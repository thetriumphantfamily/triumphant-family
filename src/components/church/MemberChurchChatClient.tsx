// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER CHURCH-WIDE CHAT – Real-time + notify all members + admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface Message {
  id: string;
  member_id: string | null;
  member_name: string;
  member_photo: string | null;
  message: string;
  is_from_admin: boolean;
  created_at: string;
}

function timeAgo(d: string): string {
  const now = new Date();
  const then = new Date(d);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberChurchChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhoto, setMemberPhoto] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    loadMember();
    loadMessages();
    loadOnlineCount();

    const supabase = createClient();
    const channel = supabase
      .channel("church-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tfam_church_messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as Message]);
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMember = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) {
                setMemberName(parsed.full_name);
                if (parsed.id) setMemberId(parsed.id);
                if (parsed.photo_url) setMemberPhoto(parsed.photo_url);
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }
  };

  const loadMessages = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_church_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(200);
      setMessages(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadOnlineCount = async () => {
    try {
      const supabase = createClient();
      const { count } = await supabase
        .from("tfam_members")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved");
      setOnlineCount(count || 0);
    } catch { /* ignore */ }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!memberId) {
      toast.error("Please login");
      return;
    }

    setIsSending(true);
    try {
      const supabase = createClient();
      const messageText = chatInput.trim();

      // 1. Send the message
      await supabase.from("tfam_church_messages").insert({
        member_id: memberId,
        member_name: memberName,
        member_photo: memberPhoto,
        message: messageText,
        is_from_admin: false,
      });

      // 2. Notify admin
      await notifyAdmin({
        title: "💬 Church Chat",
        message: `${memberName}: ${messageText.substring(0, 100)}${messageText.length > 100 ? "..." : ""}`,
        type: "church_chat",
        link: "/admin/church/church-chat",
      });

      // 3. Notify ALL OTHER approved members (not the sender)
      const { data: allMembers } = await supabase
        .from("tfam_members")
        .select("id")
        .eq("status", "approved")
        .neq("id", memberId);

      if (allMembers && allMembers.length > 0) {
        const notifications = allMembers.map((m) => ({
          recipient_type: "member",
          recipient_id: m.id,
          title: `💬 ${memberName} in Church Chat`,
          message: messageText.substring(0, 100) + (messageText.length > 100 ? "..." : ""),
          type: "church_chat",
          link: "/member/church-chat",
          is_read: false,
        }));

        await supabase.from("tfam_notifications").insert(notifications);
      }

      setChatInput("");
    } catch {
      toast.error("Failed");
    } finally {
      setIsSending(false);
    }
  };

  const deleteMyMessage = async (msgId: string, senderId: string | null) => {
    if (senderId !== memberId) return;
    if (!confirm("Delete this message?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_church_messages").delete().eq("id", msgId);
    } catch {
      toast.error("Failed");
    }
  };

  const firstName = memberName.split(" ")[0] || "";

  if (loading) return <LoadingScreen message="Loading chat..." />;

  return (
    <div className="space-y-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Church Chat — Live
            </span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Family Chatroom
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">
            Fellowship with all {onlineCount}+ TFAM members in real-time.
          </p>
        </div>
      </div>

      {/* ── Chat Container ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl flex flex-col h-[600px]">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        {/* Chat Header Bar */}
        <div className="flex-shrink-0 p-4 border-b border-brand-gold-400/30 bg-brand-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-lg">
              💬
            </div>
            <div>
              <p className="text-white font-black text-sm">TFAM Family Chat</p>
              <p className="text-brand-purple-200 text-xs">🟢 Real-time • All members notified</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-white font-black mb-2">Welcome to the Family Chatroom!</p>
              <p className="text-brand-purple-200 text-sm">Be the first to say hello 👋</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.member_id === memberId;
              const isAdmin = m.is_from_admin;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"} group`}
                >
                  <div className="max-w-[85%] flex gap-2 items-start">
                    {/* Avatar for other members */}
                    {!isMine && !isAdmin && (
                      <>
                        {m.member_photo ? (
                          <img
                            src={m.member_photo}
                            alt={m.member_name}
                            className="w-8 h-8 rounded-full object-cover border border-brand-gold-400/40 flex-shrink-0 mt-1"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-white font-black text-xs flex-shrink-0 mt-1">
                            {m.member_name.charAt(0)}
                          </div>
                        )}
                      </>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl p-3 relative ${
                        isAdmin
                          ? "bg-brand-purple-950/80 text-white border-2 border-green-400/60 shadow-lg"
                          : isMine
                          ? "bg-brand-purple-950/80 text-white border border-brand-gold-400/40"
                          : "bg-brand-purple-950/60 text-white border border-brand-gold-400/30"
                      }`}
                    >
                      {/* Sender Name / Pastor Badge */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {isAdmin ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-white text-brand-purple-900">
                            👑 PASTOR
                          </span>
                        ) : !isMine ? (
                          <p className="text-xs font-black text-white/60">
                            {m.member_name}
                          </p>
                        ) : null}
                      </div>

                      {/* Message Text */}
                      <p className="text-sm font-semibold whitespace-pre-wrap break-words">
                        {m.message}
                      </p>

                      {/* Timestamp + Delete */}
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-xs text-brand-purple-300">
                          {timeAgo(m.created_at)}
                        </p>
                        {isMine && (
                          <button
                            onClick={() => deleteMyMessage(m.id, m.member_id)}
                            className="text-xs opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* ── Message Input ── */}
        <form
          onSubmit={sendMessage}
          className="p-3 border-t border-brand-gold-400/30 bg-brand-purple-950/40 flex gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            maxLength={500}
            className="flex-1 p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSending || !chatInput.trim()}
            className="px-5 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0"
          >
            {isSending ? "..." : "Send →"}
          </button>
        </form>
      </div>
    </div>
  );
}