// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN CHAT CLIENT – Moderator View (WhatsApp Style)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Message {
  id: string;
  sender_id: string | null;
  sender_name: string;
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

export default function TDAAdminChatClient() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    const supabase = createClient();
    const channel = supabase
      .channel("tda-admin-mod")
      .on("postgres_changes", { event: "*", schema: "public", table: "tda_chat_messages" }, 
        (payload) => {
          if (payload.eventType === "INSERT") {
            const m = payload.new as Message;
            setMessages(prev => prev.some(x => x.id === m.id) ? prev : [...prev, m]);
          } else if (payload.eventType === "UPDATE" || payload.eventType === "DELETE") {
            loadMessages();
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
    const { data } = await supabase.from("tda_chat_messages").select("*").eq("is_deleted", false).order("created_at", { ascending: true });
    setMessages(data || []);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);
    const supabase = createClient();
    const { error } = await supabase.from("tda_chat_messages").insert({
      sender_id: null,
      sender_name: "Administrator",
      message: newMessage.trim(),
      is_admin: true
    });
    if (error) toast.error("Failed");
    else setNewMessage("");
    setIsSending(false);
  };

  const deleteMsg = async (id: string) => {
    if(!confirm("Delete this message?")) return;
    const supabase = createClient();
    await supabase.from("tda_chat_messages").update({ is_deleted: true }).eq("id", id);
    toast.success("Deleted");
  };

  if (loading) return <LoadingScreen message="Loading moderator chat..." />;

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-purple-950/20 rounded-t-3xl border-2 border-brand-gold-400/20">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.is_admin ? "justify-end" : "justify-start"} group`}>
            <div className={`relative max-w-[80%] p-3 rounded-2xl border ${
              m.is_admin ? "bg-white text-brand-purple-900 border-green-500" : "bg-brand-purple-900/60 text-white border-white/10"
            }`}>
              <div className="flex justify-between gap-4 mb-1">
                <span className="text-[10px] font-black">{m.sender_name}</span>
                <span className="text-[9px] opacity-50">{formatTime(m.created_at)}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{m.message}</p>
              <button onClick={() => deleteMsg(m.id)} className="absolute -top-2 -left-2 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-brand-purple-900 rounded-b-3xl border-2 border-t-0 border-brand-gold-400/20 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Post as Administrator..."
          className="flex-1 bg-brand-purple-950/60 border border-brand-gold-400/40 rounded-xl px-4 py-2 text-white focus:outline-none"
        />
        <button onClick={handleSend} className="bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black px-6 rounded-xl">SEND</button>
      </div>
    </div>
  );
}