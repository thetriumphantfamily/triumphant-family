// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA CHAT CLIENT — Real-time discussion room with Supabase Realtime
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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

interface Session {
  id: string;
  full_name: string;
  student_id: string;
  photo_url: string | null;
}

// Format time
function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format date for separator
function formatDateSeparator(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function TDAChatClient() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
    loadMessages();
    setupRealtimeSubscription();

    return () => {
      // Cleanup
      const supabase = createClient();
      supabase.removeAllChannels();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSession = () => {
    const sessionData = localStorage.getItem("tda_student_session");
    if (sessionData) {
      try {
        setSession(JSON.parse(sessionData));
      } catch (err) {
        console.error("Session parse error:", err);
      }
    }
  };

  const loadMessages = async () => {
    try {
      const supabase = createClient();

      const { data } = await supabase
        .from("tda_chat_messages")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: true })
        .limit(200);

      setMessages(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const supabase = createClient();

    const channel = supabase
      .channel("tda-chat-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tda_chat_messages",
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (!newMsg.is_deleted) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tda_chat_messages",
        },
        (payload) => {
          const updatedMsg = payload.new as Message;
          if (updatedMsg.is_deleted) {
            setMessages((prev) => prev.filter((m) => m.id !== updatedMsg.id));
          } else {
            setMessages((prev) =>
              prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m))
            );
          }
        }
      )
      .subscribe();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !session || isSending) return;

    if (newMessage.length > 1000) {
      toast.error("Message too long (max 1000 characters)");
      return;
    }

    setIsSending(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("tda_chat_messages").insert({
        sender_id: session.id,
        sender_name: session.full_name,
        sender_photo: session.photo_url,
        message: newMessage.trim(),
        is_admin: false,
      });

      if (error) {
        console.error("Send error:", error);
        toast.error("Failed to send message");
        setIsSending(false);
        return;
      }

      setNewMessage("");
      inputRef.current?.focus();
      setIsSending(false);
    } catch (err) {
      console.error("Send error:", err);
      toast.error("Failed to send");
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Delete this message?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tda_chat_messages")
        .update({ is_deleted: true })
        .eq("id", messageId);

      if (error) {
        toast.error("Failed to delete");
        return;
      }

      toast.success("Message deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete");
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = "";

  messages.forEach((msg) => {
    const msgDate = new Date(msg.created_at).toDateString();
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({
        date: msg.created_at,
        messages: [msg],
      });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading discussion...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          💬 Discussion Room
        </h1>
        <p className="text-gray-600 text-sm">
          Chat with fellow students and instructors in real-time
        </p>
      </div>

      {/* Chat Rules Banner */}
      <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 text-brand-purple-900">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold text-brand-purple-900 text-sm mb-1">
              💡 Chat Guidelines
            </p>
            <p className="text-brand-purple-700 text-xs leading-relaxed">
              Be respectful. Keep discussions edifying. Enter to send, Shift+Enter for new line.
              Text only — no file sharing.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {groupedMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center py-16">
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-purple-100 mb-4">
                  <svg
                    className="w-10 h-10 text-brand-purple-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
                  Start the conversation!
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Be the first to send a message. Share your thoughts,
                  questions, and encouragements.
                </p>
              </div>
            </div>
          ) : (
            groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Date Separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                    {formatDateSeparator(group.date)}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Messages for this date */}
                {group.messages.map((message) => {
                  const isOwn = message.sender_id === session?.id;
                  const isAdmin = message.is_admin;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 mb-3 ${
                        isOwn ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      {message.sender_photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={message.sender_photo}
                          alt={message.sender_name}
                          className={`w-9 h-9 rounded-full object-cover border-2 flex-shrink-0 ${
                            isAdmin
                              ? "border-brand-gold-400"
                              : "border-gray-200"
                          }`}
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                            isAdmin
                              ? "bg-brand-gold-500"
                              : "bg-brand-purple-500"
                          }`}
                        >
                          {message.sender_name.charAt(0)}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`flex flex-col max-w-[75%] ${
                          isOwn ? "items-end" : "items-start"
                        }`}
                      >
                        {/* Sender name */}
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span
                            className={`text-xs font-bold ${
                              isAdmin
                                ? "text-brand-gold-600"
                                : isOwn
                                ? "text-brand-purple-600"
                                : "text-gray-700"
                            }`}
                          >
                            {isOwn ? "You" : message.sender_name}
                          </span>
                          {isAdmin && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-brand-gold-500 text-white text-[9px] font-bold uppercase">
                              Admin
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400">
                            {formatTime(message.created_at)}
                          </span>
                        </div>

                        {/* Bubble */}
                        <div className="relative group">
                          <div
                            className={`px-4 py-2.5 rounded-2xl ${
                              isAdmin
                                ? "bg-gradient-to-br from-brand-gold-100 to-brand-gold-200 border-2 border-brand-gold-400 text-brand-purple-900"
                                : isOwn
                                ? "bg-brand-purple-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                              {message.message}
                            </p>
                          </div>

                          {/* Delete button (only for own messages) */}
                          {isOwn && (
                            <button
                              onClick={() => handleDelete(message.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center shadow-md"
                              aria-label="Delete message"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
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

        {/* Input Area */}
        <div className="border-t-2 border-gray-100 p-4 bg-gray-50">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send)"
              rows={1}
              maxLength={1000}
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white resize-none max-h-32"
              style={{ minHeight: "48px" }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              className="w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Send message"
            >
              {isSending ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Character counter */}
          {newMessage.length > 800 && (
            <p
              className={`text-xs mt-2 text-right ${
                newMessage.length > 950 ? "text-red-600 font-bold" : "text-gray-500"
              }`}
            >
              {newMessage.length} / 1000
            </p>
          )}
        </div>
      </div>
    </div>
  );
}