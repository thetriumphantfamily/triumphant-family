// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MESSAGES LIST — Interactive admin messages management
// Email button now opens Gmail web (works reliably on all devices)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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

export default function MessagesList({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // ━━━ Filter messages ━━━
  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.is_read && !m.is_archived;
    if (filter === "archived") return m.is_archived;
    return !m.is_archived; // "all" = all non-archived
  });

  // ━━━ Toggle read/unread ━━━
  const toggleRead = async (id: string, currentIsRead: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: !currentIsRead })
        .eq("id", id);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, is_read: !currentIsRead } : m
        )
      );
      toast.success(currentIsRead ? "Marked as unread" : "Marked as read");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update message");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Archive/unarchive ━━━
  const toggleArchive = async (id: string, currentIsArchived: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_archived: !currentIsArchived })
        .eq("id", id);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, is_archived: !currentIsArchived } : m
        )
      );
      toast.success(currentIsArchived ? "Restored" : "Archived");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update message");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Delete message ━━━
  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

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

  // ━━━ Handle expand + auto-mark as read ━━━
  const handleExpand = (msg: Message) => {
    const newExpandedId = expandedId === msg.id ? null : msg.id;
    setExpandedId(newExpandedId);

    // Auto-mark as read when opened
    if (newExpandedId && !msg.is_read) {
      toggleRead(msg.id, false);
    }
  };

  // ━━━ Format date ━━━
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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ━━━ Build Gmail compose URL ━━━
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
                ? "bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 text-white shadow-brand"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-brand-purple-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredMessages.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
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
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No messages here
          </h3>
          <p className="text-gray-500">
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
              className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${
                isUnread
                  ? "border-brand-purple-300 shadow-md"
                  : "border-gray-100"
              } ${isExpanded ? "border-brand-gold-400 shadow-lg" : ""}`}
            >
              {/* Header (always visible) */}
              <button
                onClick={() => handleExpand(msg)}
                className="w-full p-5 text-left flex items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-md ${
                    isUnread
                      ? "bg-gradient-to-br from-brand-purple-500 to-brand-purple-700"
                      : "bg-gradient-to-br from-gray-400 to-gray-500"
                  }`}
                >
                  {msg.full_name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3
                          className={`font-heading font-bold truncate ${
                            isUnread
                              ? "text-brand-purple-900"
                              : "text-gray-700"
                          }`}
                        >
                          {msg.full_name}
                        </h3>
                        {isUnread && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-brand-purple-600 font-semibold mb-1">
                        {SUBJECT_LABELS[msg.subject] || msg.subject}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {msg.message}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </div>

                {/* Expand icon */}
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  {/* Contact info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-brand-purple-600 font-semibold hover:underline break-all"
                      >
                        {msg.email}
                      </a>
                    </div>
                    {msg.phone && (
                      <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
                          Phone
                        </p>
                        <a
                          href={`tel:${msg.phone}`}
                          className="text-brand-purple-600 font-semibold hover:underline"
                        >
                          {msg.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Full message */}
                  <div className="bg-white rounded-xl p-5 border border-gray-100 mb-5">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">
                      Message
                    </p>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {/* Reply via Gmail (opens in browser) */}
                    <a
                      href={buildGmailUrl(msg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-brand-purple-600 to-brand-purple-700 hover:from-brand-purple-700 hover:to-brand-purple-800 text-white text-sm font-bold shadow-brand hover:shadow-brand-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      Reply via Gmail
                    </a>

                    {/* Reply via WhatsApp (if phone) */}
                    {msg.phone && (
                      <a
                        href={`https://wa.me/${msg.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(msg.full_name)}%2C%20thank%20you%20for%20contacting%20The%20Triumphant%20Family%20Ministry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                        </svg>
                        WhatsApp
                      </a>
                    )}

                    {/* Toggle read */}
                    <button
                      onClick={() => toggleRead(msg.id, msg.is_read)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-sm font-bold transition-all disabled:opacity-50"
                    >
                      {msg.is_read ? "Mark as Unread" : "Mark as Read"}
                    </button>

                    {/* Archive */}
                    <button
                      onClick={() => toggleArchive(msg.id, msg.is_archived)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-sm font-bold transition-all disabled:opacity-50"
                    >
                      {msg.is_archived ? "Restore" : "Archive"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 text-sm font-bold transition-all disabled:opacity-50 ml-auto"
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