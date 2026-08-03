// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER NOTIFICATIONS — Dashboard pattern (purple cards, white text)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

function timeAgo(d: string): string {
  const now = new Date();
  const then = new Date(d);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberNotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");

  useEffect(() => { loadMemberAndNotifications(); }, []);

  const loadMemberAndNotifications = async () => {
    let foundId = "";
    let foundName = "";

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
                foundName = parsed.full_name;
                if (parsed.id) foundId = parsed.id;
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }

    setMemberId(foundId);
    setMemberName(foundName);

    if (foundId) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("tfam_notifications")
          .select("*")
          .eq("recipient_type", "member")
          .eq("recipient_id", foundId)
          .order("created_at", { ascending: false });
        setNotifications(data || []);
      } catch (err) { console.error(err); }
    }

    setLoading(false);
  };

  const markAsRead = async (id: string, link?: string | null) => {
    try {
      const supabase = createClient();
      await supabase.from("tfam_notifications").update({ is_read: true }).eq("id", id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
      if (link) window.location.href = link;
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    if (!memberId) return;
    try {
      const supabase = createClient();
      await supabase
        .from("tfam_notifications")
        .update({ is_read: true })
        .eq("recipient_type", "member")
        .eq("recipient_id", memberId)
        .eq("is_read", false);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const firstName = memberName.split(" ")[0] || "";

  if (loading) {
    return <LoadingScreen message="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Notifications</span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">{getGreeting()}{firstName ? `, ${firstName}` : ""}!</p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Your Notifications</h1>
          <div className="flex gap-4 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{notifications.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{unreadCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Unread</p>
            </div>
          </div>
        </div>
      </div>

      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button onClick={markAllAsRead} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all">
            ✅ Mark All as Read
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🔔</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">No Notifications Yet</h2>
          <p className="text-brand-purple-200 text-sm">When there are updates for you, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <button
              key={item.id}
              onClick={() => markAsRead(item.id, item.link)}
              className={`w-full text-left relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 p-5 shadow-xl transition-all hover:-translate-y-0.5 ${
                item.is_read ? "border-brand-gold-400/25 opacity-85" : "border-brand-gold-400/60"
              }`}
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {!item.is_read && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white">NEW</span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-purple-950/60 text-brand-purple-200 border border-brand-gold-400/20 capitalize">
                    {item.type.replace(/_/g, " ")}
                  </span>
                </div>
                <span className="text-brand-purple-300 text-xs font-semibold whitespace-nowrap">{timeAgo(item.created_at)}</span>
              </div>

              <p className="font-black text-white text-base mb-1">{item.title}</p>
              <p className="text-white/80 font-semibold text-sm leading-relaxed">{item.message}</p>

              {item.link && (
                <p className="text-brand-purple-300 text-xs font-bold mt-3">Tap to open →</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}