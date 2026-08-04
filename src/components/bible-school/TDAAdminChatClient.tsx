// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN CHAT CLIENT – Chat moderator with full delete powers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_photo: string | null;
  message: string;
  is_admin: boolean;
  is_deleted: boolean;
  created_at: string;
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDateSeparator(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export default function TDAAdminChatClient() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    setupRealtimeSubscription();
    return () => {
      const supabase = createClient();
      supabase.removeAllChannels();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_chat_messages").select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: true }).limit(300);
      setMessages(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const setupRealtimeSubscription = () => {
    const supabase = createClient();
    supabase.channel("tda-admin-chat-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tda_chat_messages" }, (payload) => {
        const newMsg = payload.new as Message;
        if (!newMsg.is_deleted) setMessages((prev) => [...prev, newMsg]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tda_chat_messages" }, (payload) => {
        const updatedMsg = payload.new as Message;
        if (updatedMsg.is_deleted) {
          setMessages((prev) => prev.filter((m) => m.id !== updatedMsg.id));
        } else {
          setMessages((prev) => prev.map((m) => m.id === updatedMsg.id ? updatedMsg : m));
        }
      })
      .subscribe();
  };

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;
    if (newMessage.length > 1000) { toast.error("Message too long (max 1000 characters)"); return; }
    setIsSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_chat_messages").insert({
        sender_id: null, sender_name: "Administrator",
        sender_photo: "/images/logo/logo.png",
        message: newMessage.trim(), is_admin: true,
      });
      if (error) { toast.error("Failed to send message"); setIsSending(false); return; }
      setNewMessage("");
      inputRef.current?.focus();
    } catch { toast.error("Failed to send"); }
    finally { setIsSending(false); }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleDelete = async (messageId: string, senderName: string) => {
    if (!confirm(`Delete message from ${senderName}?`)) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_chat_messages").update({ is_deleted: true }).eq("id", messageId);
      if (error) { toast.error("Failed to delete"); return; }
      toast.success("Message deleted");
    } catch { toast.error("Failed to delete"); }
  };

  // Group by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = "";
  messages.forEach((msg) => {
    const msgDate = new Date(msg.created_at).toDateString();
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ date: msg.created_at, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading chat..." />;

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-4rem)]">

      {/* ── Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 md:p-6 shadow-2xl mb-3">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <h1 className="font-heading text-lg md:text-2xl font-bold text-white mb-1">💬 Chat Moderator</h1>
          <p className="text-brand-purple-200 text-xs">
            Real-time discussion with students — you can delete any message.
          </p>
        </div>
      </div>

      {/* ── Moderator Banner ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-red-400/60 p-3 mb-3">
        <p className="text-white text-xs font-semibold">
          <strong className="text-white">🛡️ MODERATOR MODE:</strong> Your messages show &ldquo;Admin&rdquo; badge. Hover any message to delete it.
        </p>
      </div>

      {/* ── Chat Container ── */}
      <div className="flex-1 relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {groupedMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center py-16">
              <div>
                <div className="text-5xl mb-4">💬</div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">No messages yet</h3>
                <p className="text-brand-purple-200 text-sm">Start the conversation by sending a message below</p>
              </div>
            </div>
          ) : (
            groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Date Separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="flex-1 h-px bg-brand-gold-400/20" />
                  <span className="px-3 py-1 rounded-full bg-brand-purple-950/60 text-brand-purple-200 text-xs font-semibold border border-brand-gold-400/30">
                    {formatDateSeparator(group.date)}
                  </span>
                  <div className="flex-1 h-px bg-brand-gold-400/20" />
                </div>

                {group.messages.map((message) => {
                  const isAdmin = message.is_admin;
                  return (
                    <div key={message.id} className="flex gap-3 mb-3">
                      {/* Avatar */}
                      {message.sender_photo && message.sender_photo !== "/images/logo/logo.png" ? (
                        <img
                          src={message.sender_photo}
                          alt={message.sender_name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-brand-gold-400/40 flex-shrink-0"
                        />
                      ) : (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 border-2 border-brand-gold-400/40 ${
                          isAdmin ? "bg-brand-purple-950/80" : "bg-brand-purple-950/60"
                        }`}>
                          {isAdmin ? "A" : message.sender_name.charAt(0)}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div className="flex flex-col max-w-[75%]">
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-xs font-black text-white/80">{message.sender_name}</span>
                          {isAdmin && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-white text-brand-purple-900 text-[9px] font-black uppercase">Admin</span>
                          )}
                          <span className="text-[10px] text-brand-purple-300">{formatTime(message.created_at)}</span>
                        </div>

                        <div className="relative group">
                          <div className={`px-4 py-2.5 rounded-2xl ${
                            isAdmin
                              ? "bg-brand-purple-950/80 text-white border-2 border-green-400/60"
                              : "bg-brand-purple-950/60 text-white border border-brand-gold-400/30"
                          }`}>
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed text-white">
                              {message.message}
                            </p>
                          </div>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(message.id, message.sender_name)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Area ── */}
        <div className="border-t border-brand-gold-400/30 p-3 bg-brand-purple-950/40">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message as Administrator... (Enter to send)"
              rows={1}
              maxLength={1000}
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none max-h-32 font-semibold text-sm"
              style={{ minHeight: "48px" }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              className="w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isSending ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
            </button>
          </div>
          {newMessage.length > 800 && (
            <p className={`text-xs mt-2 text-right ${newMessage.length > 950 ? "text-red-400 font-black" : "text-brand-purple-200"}`}>
              {newMessage.length} / 1000
            </p>
          )}
        </div>
      </div>
    </div>
  );
}