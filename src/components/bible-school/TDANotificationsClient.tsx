// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA NOTIFICATIONS CLIENT – Student notifications
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Notification {
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
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    graduation: "🎓",
    assignment: "📝",
    graded: "⭐",
    announcement: "📢",
    material: "📚",
    attendance: "✅",
    general: "🔔",
  };
  return icons[type] || "🔔";
}

export default function TDANotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      setStudentId(sessionData.id);

      const supabase = createClient();
      const { data } = await supabase
        .from("tda_notifications")
        .select("*")
        .eq("recipient_id", sessionData.id)
        .order("created_at", { ascending: false });

      setNotifications(data || []);

      // Mark all as read
      if (data && data.length > 0) {
        await supabase
          .from("tda_notifications")
          .update({ is_read: true })
          .eq("recipient_id", sessionData.id)
          .eq("is_read", false);
      }

      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) return <LoadingScreen message="Loading notifications..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Notifications</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            🔔 Notifications
          </h1>
          <p className="text-brand-purple-200 text-sm">
            All your TDA updates and alerts.
          </p>
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

      {/* ── Notifications List ── */}
      {notifications.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No Notifications Yet</h3>
          <p className="text-brand-purple-200 text-sm">Your school notifications will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                !n.is_read ? "border-brand-gold-400/60" : "border-brand-gold-400/30 opacity-80"
              } p-4 shadow-xl`}
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl flex-shrink-0">
                  {getTypeIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {!n.is_read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-brand-purple-900 text-[10px] font-black uppercase">
                        NEW
                      </span>
                    )}
                    <span className="text-brand-purple-200 text-xs font-semibold">
                      {timeAgo(n.created_at)}
                    </span>
                  </div>
                  <p className="font-black text-white text-sm mb-1">{n.title}</p>
                  <p className="text-brand-purple-200 text-xs leading-relaxed">{n.message}</p>
                  {n.link && (
                    <Link
                      href={n.link}
                      className="inline-flex items-center gap-1 mt-2 text-xs text-white/80 font-black hover:text-white"
                    >
                      View →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}