// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITE NOTIFICATIONS CLIENT — Main website admin notifications
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface SiteNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

type FilterType = "all" | "unread" | "contact" | "prayer" | "testimony" | "newsletter";

const TYPE_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  contact:    { emoji: "✉️",  label: "Contact",    color: "border-blue-400/40" },
  prayer:     { emoji: "🙏",  label: "Prayer",     color: "border-brand-purple-400/40" },
  testimony:  { emoji: "✨",  label: "Testimony",  color: "border-brand-gold-400/40" },
  newsletter: { emoji: "📧",  label: "Newsletter", color: "border-green-400/40" },
  visitor:    { emoji: "👁️", label: "Visitor",    color: "border-brand-purple-400/40" },
  info:       { emoji: "ℹ️",  label: "Info",       color: "border-brand-gold-400/40" },
};

export default function SiteNotificationsClient({
  initialNotifications,
}: {
  initialNotifications: SiteNotification[];
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<SiteNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  if (loading) return <LoadingScreen message="Loading notifications..." />;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "all") return true;
    return n.type === filter;
  });

  // ━━━ Mark one as read ━━━
  const markRead = async (id: string) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      await supabase.from("site_notifications").update({ is_read: true }).eq("id", id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
      router.refresh();
    } catch {
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Mark all as read ━━━
  const markAllRead = async () => {
    try {
      const supabase = createClient();
      await supabase.from("site_notifications").update({ is_read: true }).eq("is_read", false);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("All marked as read ✅");
      router.refresh();
    } catch {
      toast.error("Could not update");
    }
  };

  // ━━━ Delete one ━━━
  const deleteOne = async (id: string) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      await supabase.from("site_notifications").delete().eq("id", id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      router.refresh();
    } catch {
      toast.error("Could not delete");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Delete all read ━━━
  const deleteAllRead = async () => {
    if (!confirm("Delete all read notifications? This cannot be undone.")) return;
    try {
      const supabase = createClient();
      await supabase.from("site_notifications").delete().eq("is_read", true);
      setNotifications((prev) => prev.filter((n) => !n.is_read));
      toast.success("Cleared read notifications");
      router.refresh();
    } catch {
      toast.error("Could not clear");
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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all" as const, label: "All" },
            { value: "unread" as const, label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
            { value: "contact" as const, label: "✉️ Contact" },
            { value: "prayer" as const, label: "🙏 Prayer" },
            { value: "testimony" as const, label: "✨ Testimony" },
            { value: "newsletter" as const, label: "📧 Newsletter" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                filter === tab.value
                  ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                  : "bg-white text-brand-purple-900 font-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 rounded-full bg-white text-brand-purple-900 font-black text-sm transition-all"
            >
              ✅ Mark All Read
            </button>
          )}
          <button
            onClick={deleteAllRead}
            className="px-4 py-2 rounded-full bg-red-600 text-white font-black text-sm transition-all"
          >
            🗑️ Clear Read
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-12 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No notifications</h3>
          <p className="text-brand-purple-200 font-semibold">
            {filter === "unread" ? "All caught up! No unread notifications." : "No notifications yet. They will appear here when visitors interact with the website."}
          </p>
        </div>
      )}

      {/* Notifications list */}
      <div className="space-y-3">
        {filtered.map((notif) => {
          const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
          const isBusy = busyId === notif.id;

          return (
            <div
              key={notif.id}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 transition-all shadow-xl ${
                !notif.is_read ? "border-brand-gold-400/60" : "border-brand-gold-400/20 opacity-80"
              }`}
            >
              <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 ${notif.is_read ? "opacity-30" : ""}`} />

              <div className="relative z-10 p-5 flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl bg-brand-purple-950/60 border ${config.color}`}>
                  {config.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-white">{notif.title}</h3>
                      {!notif.is_read && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                          NEW
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-purple-950/60 text-white border ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <span className="text-xs text-brand-purple-300 font-semibold whitespace-nowrap">
                      {formatDate(notif.created_at)}
                    </span>
                  </div>

                  <p className="text-brand-purple-200 font-semibold text-sm mb-3">
                    {notif.message}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {notif.link && (
                      <Link
                        href={notif.link}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-xs font-black transition-all"
                      >
                        View →
                      </Link>
                    )}
                    {!notif.is_read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-brand-purple-900 text-xs font-black transition-all disabled:opacity-50"
                      >
                        ✅ Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteOne(notif.id)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-black transition-all disabled:opacity-50"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}