// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA CHAT CLIENT – Shared Discussion Room (WhatsApp Style)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";
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
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-purple-950/20 rounded-t-3xl border-2 border-brand-gold-400/20 border-b-0">
        {messages.map((m) => {
          const isMe = m.sender_id === session?.id;
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-lg border ${
                m.is_admin 
                  ? "bg-white text-brand-purple-900 border-green-400" 
                  : isMe 
                  ? "bg-brand-purple-800 text-white border-brand-gold-400/40" 
                  : "bg-brand-purple-900/60 text-white border-white/10"
              }`}>
                <div className="flex justify-between items-center gap-4 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
                    {m.is_admin ? "👑 INSTRUCTOR" : isMe ? "YOU" : m.sender_name}
                  </span>
                  <span className="text-[9px] opacity-50">{formatTime(m.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-brand-purple-900 border-2 border-brand-gold-400/20 rounded-b-3xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-brand-purple-950/60 border border-brand-gold-400/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold-400"
          />
          <button onClick={handleSend} disabled={isSending} className="bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black px-6 rounded-xl active:scale-95 transition-all">
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}