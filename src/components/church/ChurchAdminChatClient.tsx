// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN CHURCH-WIDE CHAT – Pastor participates + auto-notify all
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAllMembers } from "@/lib/notifications";
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

export default function ChurchAdminChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [totalMembers, setTotalMembers] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    loadMemberCount();

    const supabase = createClient();
    const channel = supabase
      .channel("admin-church-messages")
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

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    } catch (err) { console.error(err); setLoading(false); }
  };

  const loadMemberCount = async () => {
    try {
      const supabase = createClient();
      const { count } = await supabase
        .from("tfam_members")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved");
      setTotalMembers(count || 0);
    } catch { /* ignore */ }
  };

  const sendAdminMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setIsSending(true);
    try {
      const supabase = createClient();
      const messageText = chatInput.trim();

      await supabase.from("tfam_church_messages").insert({
        member_id: null,
        member_name: "Pastor",
        member_photo: null,
        message: messageText,
        is_from_admin: true,
      });

      await notifyAllMembers({
        title: "👑 Pastor in Church Chat",
        message: messageText.substring(0, 100) + (messageText.length > 100 ? "..." : ""),
        type: "church_chat",
        link: "/member/church-chat",
      });

      toast.success("Sent to all members!");
      setChatInput("");
    } catch { toast.error("Failed"); }
    finally { setIsSending(false); }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_church_messages").delete().eq("id", id);
    } catch { toast.error("Failed"); }
  };

  const totalMessages = messages.length;
  const adminMessages = messages.filter((m) => m.is_from_admin).length;
  const memberMessages = totalMessages - adminMessages;

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading chat..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Church Chat — Live</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Family Chatroom
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Participate as 👑 Pastor. All messages auto-notify members.
          </p>
          <div className="flex gap-4 flex-wrap pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{totalMembers}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Members</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{totalMessages}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{adminMessages}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">From Pastor</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{memberMessages}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">From Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat Container ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl flex flex-col h-[600px]">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        {/* Chat Header */}
        <div className="flex-shrink-0 p-4 border-b border-brand-gold-400/30 bg-brand-purple-950/40">
          <p className="text-white font-black text-sm">💬 TFAM Family Chat</p>
          <p className="text-brand-purple-200 text-xs">
            🟢 Real-time • Posting as 👑 Pastor • Auto-notifies all
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-white font-black">No messages yet</p>
              <p className="text-brand-purple-200 text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((m) => {
              const isAdmin = m.is_from_admin;
              return (
                <div
                  key={m.id}
                  className={`flex ${isAdmin ? "justify-end" : "justify-start"} group`}
                >
                  <div className="max-w-[85%] flex gap-2 items-start">
                    {/* Member Avatar */}
                    {!isAdmin && (
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
                    <div className={`rounded-2xl p-3 relative ${
                      isAdmin
                        ? "bg-brand-purple-950/80 text-white border-2 border-green-400/60 shadow-lg"
                        : "bg-brand-purple-950/60 text-white border border-brand-gold-400/30"
                    }`}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {isAdmin ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-white text-brand-purple-900">
                            👑 PASTOR
                          </span>
                        ) : (
                          <p className="text-xs font-black text-white/80">{m.member_name}</p>
                        )}
                      </div>
                      <p className="text-sm font-semibold whitespace-pre-wrap break-words text-white">
                        {m.message}
                      </p>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-xs text-brand-purple-200">
                          {timeAgo(m.created_at)}
                        </p>
                        <button
                          onClick={() => deleteMessage(m.id)}
                          className="text-xs opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={sendAdminMessage}
          className="p-3 border-t border-brand-gold-400/30 bg-brand-purple-950/40 flex gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message as Pastor..."
            disabled={isSending}
            maxLength={500}
            className="flex-1 p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSending || !chatInput.trim()}
            className="px-5 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
          >
            {isSending ? "..." : "Send →"}
          </button>
        </form>
      </div>
    </div>
  );
}