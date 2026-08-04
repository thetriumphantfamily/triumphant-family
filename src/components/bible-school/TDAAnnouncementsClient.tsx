// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ANNOUNCEMENTS CLIENT – View all school announcements
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Announcement {
  id: string;
  title: string;
  body: string;
  is_important: boolean;
  level: string | null;
  created_at: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function TDAAnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [studentLevel, setStudentLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "important">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      setStudentLevel(sessionData.level);
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_announcements").select("*")
        .or(`level.eq.${sessionData.level},level.is.null`)
        .order("created_at", { ascending: false });
      setAnnouncements(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (filter === "important") return a.is_important;
    return true;
  });

  const importantCount = announcements.filter((a) => a.is_important).length;

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading announcements..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Announcements</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            📢 Announcements
          </h1>
          <p className="text-brand-purple-200 text-sm">
            Stay updated with news from Triumphant Disciples Academy.
          </p>
          <div className="flex gap-4 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{announcements.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{importantCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Important</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all ${
            filter === "all"
              ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
              : "bg-white text-brand-purple-900"
          }`}
        >
          📋 All ({announcements.length})
        </button>
        <button
          onClick={() => setFilter("important")}
          className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all ${
            filter === "important"
              ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
              : "bg-white text-brand-purple-900"
          }`}
        >
          🚨 Important ({importantCount})
        </button>
      </div>

      {/* ── Announcements List ── */}
      {filteredAnnouncements.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📢</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            {filter === "important" ? "No important announcements" : "No announcements yet"}
          </h3>
          <p className="text-brand-purple-200 text-sm">Check back later for school updates and news.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map((announcement) => {
            const isExpanded = expandedId === announcement.id;
            return (
              <div
                key={announcement.id}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                  announcement.is_important ? "border-red-400/60" : "border-brand-gold-400/40"
                } shadow-xl`}
              >
                <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${
                  announcement.is_important
                    ? "from-red-400 via-red-500 to-red-400"
                    : "from-brand-gold-300 via-brand-gold-400 to-brand-gold-500"
                }`} />

                {/* Header — tap to expand */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : announcement.id)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center flex-shrink-0 text-xl">
                      {announcement.is_important ? "🚨" : "📢"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {announcement.is_important && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase">
                                Important
                              </span>
                            )}
                            <span className="text-brand-purple-200 text-xs font-semibold">
                              {formatDate(announcement.created_at)}
                            </span>
                          </div>
                          <h3 className="font-heading font-black text-white text-base leading-tight">
                            {announcement.title}
                          </h3>
                        </div>
                        <svg
                          className={`w-5 h-5 text-white/60 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                      {!isExpanded && (
                        <p className="text-brand-purple-200 text-sm line-clamp-2">{announcement.body}</p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5">
                    <div className="bg-brand-purple-950/60 rounded-2xl p-4 border border-brand-gold-400/30">
                      <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-line mb-3">
                        {announcement.body}
                      </p>
                      <div className="pt-3 border-t border-brand-gold-400/20">
                        <p className="text-brand-purple-200 text-xs font-semibold">
                          🕐 Posted on {formatFullDate(announcement.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Info Note ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center flex-shrink-0 text-xl">
            💡
          </div>
          <div>
            <p className="font-black text-white mb-2">About Announcements</p>
            <ul className="text-brand-purple-200 text-sm space-y-1 list-disc pl-4">
              <li>Announcements are posted by your school administrator</li>
              <li><strong className="text-white">Important</strong> announcements are highlighted</li>
              <li>Tap any announcement to read the full message</li>
              <li>Check regularly for school updates and news</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}