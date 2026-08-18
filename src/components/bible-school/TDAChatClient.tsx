// ───────────────────────────────────────────────────────────────
// TDA CHAT CLIENT – Shared Discussion Room (Mobile-First Design)
// WhatsApp-style with proper responsive layout
// ───────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Message {
  id: string;
  sender_id: string | null;
  sender_name: string;
  sender_photo: string | null;
  message: string;
  is_admin: boolean;
  is_deleted: boolean;
  created_at: string;
}

interface StudentSession {
  id: string;
  full_name: string;
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export default function TDAChatClient() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<StudentSession | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionData = localStorage.getItem("tda_student_session");
    if (sessionData) setSession(JSON.parse(sessionData));

    loadMessages();

    const supabase = createClient();
    const channel = supabase
      .channel("tda-shared-chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tda_chat_messages" },
        (payload) => {
          const m = payload.new as Message;
          if (!m.is_deleted) {
            setMessages(prev => {
              if (prev.some(msg => msg.id === m.id)) return prev;
              return [...prev, m];
            });
          }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("tda_chat_messages")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });
    setMessages(data || []);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !session || isSending) return;
    setIsSending(true);
    const supabase = createClient();
    const { error } = await supabase.from("tda_chat_messages").insert({
      sender_id: session.id,
      sender_name: session.full_name,
      message: newMessage.trim(),
      is_admin: false
    });
    if (error) toast.error("Failed to send");
    else setNewMessage("");
    setIsSending(false);
  };

  if (loading) return <LoadingScreen message="Opening discussion..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-3 pb-4">

      {/* ── Header Card ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">
              Live Discussion
            </span>
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
            💬 TDA Discussion Room
          </h1>
          <p className="text-brand-purple-200 text-xs md:text-sm">
            Chat with fellow students and instructors
          </p>
        </div>
      </div>

      {/* ── Chat Container ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl flex flex-col h-[calc(100vh-260px)] min-h-[400px]">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 z-10" />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-white font-bold text-base mb-1">No messages yet</p>
              <p className="text-brand-purple-200 text-sm">
                Be the first to start the conversation!
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_id === session?.id;
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  {!isMe && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                      m.is_admin
                        ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
                        : "bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 text-brand-purple-900"
                    }`}>
                      {m.is_admin ? "👑" : getInitial(m.sender_name)}
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl shadow-lg border ${
                    m.is_admin
                      ? "bg-white text-brand-purple-900 border-green-400"
                      : isMe
                      ? "bg-brand-purple-800 text-white border-brand-gold-400/40 rounded-br-sm"
                      : "bg-brand-purple-950/60 text-white border-white/10 rounded-bl-sm"
                  }`}>
                    {!isMe && (
                      <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                        m.is_admin ? "text-green-700" : "text-brand-gold-300"
                      }`}>
                        {m.is_admin ? "👑 Instructor" : m.sender_name}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {m.message}
                    </p>
                    <p className={`text-[9px] mt-1 text-right ${
                      m.is_admin ? "text-brand-purple-900/60" : "text-white/50"
                    }`}>
                      {formatTime(m.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-brand-gold-400/30 p-3 bg-brand-purple-950/60">
          <div className="flex gap-2 items-end">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 bg-white border-2 border-brand-gold-400/40 rounded-2xl px-4 py-3 text-brand-purple-900 text-sm placeholder-gray-500 focus:outline-none focus:border-brand-gold-400 resize-none max-h-24"
              style={{ minHeight: "44px" }}
            />
            <button
              onClick={handleSend}
              disabled={isSending || !newMessage.trim()}
              className="bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black w-12 h-12 rounded-full active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-gold"
              aria-label="Send message"
            >
              {isSending ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Info Note ── */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/30 p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-xl">💡</div>
          <p className="text-brand-purple-200 text-xs">
            Be respectful. Share thoughts, ask questions, encourage others.
            Instructors can see all messages.
          </p>
        </div>
      </div>
    </div>
  );
}