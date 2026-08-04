// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MESSAGES LIST — Interactive admin messages management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Message {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

type FilterType = "all" | "unread" | "archived";

const SUBJECT_LABELS: Record<string, string> = {
  general: "General Inquiry",
  prayer: "Prayer Request",
  partnership: "Partnership / Giving",
  counselling: "Counselling",
  ministry: "Ministry Invitation",
  testimony: "Share a Testimony",
  other: "Other",
};

export default function MessagesList({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading] = useState(false);

  if (loading) return <LoadingScreen message="Loading messages..." />;

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.is_read && !m.is_archived;
    if (filter === "archived") return m.is_archived;
    return !m.is_archived;
  });

  const toggleRead = async (id: string, currentIsRead: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").update({ is_read: !currentIsRead }).eq("id", id);
      if (error) throw error;
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: !currentIsRead } : m));
      toast.success(currentIsRead ? "Marked as unread" : "Marked as read");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update message");
    } finally {
      setBusyId(null);
    }
  };

  const toggleArchive = async (id: string, currentIsArchived: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").update({ is_archived: !currentIsArchived }).eq("id", id);
      if (error) throw error;
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_archived: !currentIsArchived } : m));
      toast.success(currentIsArchived ? "Restored" : "Archived");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update message");
    } finally {
      setBusyId(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete message");
    } finally {
      setBusyId(null);
    }
  };

  const handleExpand = (msg: Message) => {
    const newExpandedId = expandedId === msg.id ? null : msg.id;
    setExpandedId(newExpandedId);
    if (newExpandedId && !msg.is_read) {
      toggleRead(msg.id, false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const buildGmailUrl = (msg: Message) => {
    const subject = `Re: ${SUBJECT_LABELS[msg.subject] || msg.subject}`;
    const body = `Hello ${msg.full_name},\n\nThank you for reaching out to The Triumphant Family Ministry.\n\n`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: "all" as const, label: "All Active" },
          { value: "unread" as const, label: "Unread" },
          { value: "archived" as const, label: "Archived" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
              filter === tab.value
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-white text-brand-purple-900 font-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredMessages.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-12 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">✉️</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No messages here</h3>
          <p className="text-brand-purple-200 font-semibold">
            {filter === "unread" && "All caught up! No unread messages."}
            {filter === "archived" && "No archived messages yet."}
            {filter === "all" && "No messages yet. When people fill out the contact form, they'll appear here."}
          </p>
        </div>
      )}

      {/* Messages list */}
      <div className="space-y-3">
        {filteredMessages.map((msg) => {
          const isExpanded = expandedId === msg.id;
          const isBusy = busyId === msg.id;
          const isUnread = !msg.is_read && !msg.is_archived;

          return (
            <div
              key={msg.id}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 transition-all ${
                isExpanded ? "border-brand-gold-400 shadow-2xl" : "border-brand-gold-400/40 shadow-xl"
              }`}
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Header */}
              <button onClick={() => handleExpand(msg)} className="w-full p-5 text-left flex items-start gap-4 hover:bg-brand-purple-950/30 transition-colors">
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-black text-brand-purple-900 shadow-md ${isUnread ? "bg-gradient-to-br from-brand-gold-400 to-brand-gold-500" : "bg-white"}`}>
                  {msg.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-heading font-black text-white truncate">{msg.full_name}</h3>
                        {isUnread && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-brand-gold-400 font-semibold mb-1">
                        {SUBJECT_LABELS[msg.subject] || msg.subject}
                      </p>
                      <p className="text-sm text-brand-purple-200 font-semibold truncate">{msg.message}</p>
                    </div>
                    <span className="text-xs text-brand-purple-300 font-semibold whitespace-nowrap">{formatDate(msg.created_at)}</span>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-brand-gold-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-brand-gold-400/30 p-5">
                  {/* Contact info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
                      <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold mb-1">Email</p>
                      <a href={`mailto:${msg.email}`} className="text-brand-gold-400 font-semibold hover:underline break-all">{msg.email}</a>
                    </div>
                    {msg.phone && (
                      <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
                        <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold mb-1">Phone</p>
                        <a href={`tel:${msg.phone}`} className="text-brand-gold-400 font-semibold hover:underline">{msg.phone}</a>
                      </div>
                    )}
                  </div>

                  {/* Full message */}
                  <div className="bg-brand-purple-950/60 rounded-xl p-5 border border-brand-gold-400/30 mb-5">
                    <p className="text-xs text-brand-purple-200 uppercase tracking-widest font-semibold mb-2">Message</p>
                    <p className="text-white font-semibold whitespace-pre-line leading-relaxed">{msg.message}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    <a
                      href={buildGmailUrl(msg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-sm font-black shadow-gold transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      Reply via Gmail
                    </a>
                    {msg.phone && (
                      <a
                        href={`https://wa.me/${msg.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(msg.full_name)}%2C%20thank%20you%20for%20contacting%20The%20Triumphant%20Family%20Ministry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-green-600 text-white text-sm font-black shadow-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                        </svg>
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => toggleRead(msg.id, msg.is_read)}
                      disabled={isBusy}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-brand-purple-900 text-sm font-black transition-all disabled:opacity-50"
                    >
                      {msg.is_read ? "Mark as Unread" : "Mark as Read"}
                    </button>
                    <button
                      onClick={() => toggleArchive(msg.id, msg.is_archived)}
                      disabled={isBusy}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-brand-purple-900 text-sm font-black transition-all disabled:opacity-50"
                    >
                      {msg.is_archived ? "Restore" : "Archive"}
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      disabled={isBusy}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-red-600 text-white text-sm font-black transition-all disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}