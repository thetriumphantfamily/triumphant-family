// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER ANNOUNCEMENTS CLIENT — Church notices for members
// Gold limited to: top bars, borders, pulse dot, badges. No blobs.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Announcement {
  id: string;
  title: string;
  body: string;
  is_important: boolean;
  target_department: string | null;
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
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateFull(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberAnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    loadAnnouncements();
    loadMember();
  }, []);

  const loadMember = async () => {
    let foundName = "";

    try {
      const stored = localStorage.getItem("tfam_member");
      if (stored) {
        const member = JSON.parse(stored);
        if (member.full_name) {
          foundName = member.full_name.split(" ")[0];
        }
      }
    } catch {
      // ignore
    }

    if (!foundName) {
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
                  foundName = parsed.full_name.split(" ")[0];
                  break;
                }
              }
            } catch {
              // not JSON
            }
          }
        }
      } catch {
        // ignore
      }
    }

    if (foundName) {
      setMemberName(foundName);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_member_announcements")
        .select("*")
        .order("created_at", { ascending: false });

      setAnnouncements(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">📢</div>
          <p className="text-gray-500">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ━━━ BRAND HEADER CARD ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Announcements
            </span>
          </div>

          <p className="text-white/80 font-semibold text-lg mb-1">
            {getGreeting()}
            {memberName ? `, ${memberName}` : ""}!
          </p>

          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Church Notices
          </h1>

          <p className="text-brand-purple-100 text-sm md:text-base">
            Stay updated with the latest news and ministry updates
          </p>

          <div className="flex gap-4 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{announcements.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{announcements.filter((a) => a.is_important).length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Important</p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ NO ANNOUNCEMENTS ━━━ */}
      {announcements.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📢</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">
            No Announcements Yet
          </h2>
          <p className="text-brand-purple-200 text-sm">
            When new updates are posted, they will appear here.
          </p>
        </div>
      )}

      {/* ━━━ ANNOUNCEMENTS LIST ━━━ */}
      {announcements.length > 0 && (
        <div className="space-y-3">
          {announcements.map((a) => {
            const isOpen = selected?.id === a.id;

            return (
              <button
                key={a.id}
                onClick={() => setSelected(isOpen ? null : a)}
                className={`w-full text-left relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 p-5 shadow-xl transition-all hover:-translate-y-0.5 ${
                  isOpen
                    ? "border-brand-gold-400"
                    : "border-brand-gold-400/40 hover:border-brand-gold-400/70"
                }`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {a.is_important && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-brand-purple-900">
                      ⚡ IMPORTANT
                    </span>
                  )}

                  {a.target_department && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-purple-950/60 text-white border border-brand-gold-400/30">
                      {a.target_department}
                    </span>
                  )}

                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-purple-950/60 text-brand-purple-200 border border-brand-gold-400/20">
                    {timeAgo(a.created_at)}
                  </span>
                </div>

                {/* Title */}
                <p className="font-black text-white text-lg mb-1">{a.title}</p>

                {/* Body */}
                <p
                  className={`text-white/80 font-semibold text-sm whitespace-pre-wrap ${
                    isOpen ? "" : "line-clamp-2"
                  }`}
                >
                  {a.body}
                </p>

                {/* Expanded */}
                {isOpen && (
                  <div className="mt-4 pt-3 border-t border-brand-gold-400/30">
                    <p className="text-brand-purple-300 text-xs font-semibold">
                      📅 Posted: {formatDateFull(a.created_at)}
                    </p>
                  </div>
                )}

                {/* Hint */}
                {!isOpen && a.body.length > 120 && (
                  <p className="text-brand-purple-300 text-xs font-bold mt-2">
                    Tap to read more →
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}