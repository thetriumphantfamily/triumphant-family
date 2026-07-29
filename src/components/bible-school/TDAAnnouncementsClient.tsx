// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ANNOUNCEMENTS CLIENT — View all school announcements
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Announcement {
  id: string;
  title: string;
  body: string;
  is_important: boolean;
  level: string | null;
  created_at: string;
}

// Format date
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

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format full date
function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TDAAnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [studentLevel, setStudentLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "important">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      setStudentLevel(sessionData.level);

      const supabase = createClient();

      const { data } = await supabase
        .from("tda_announcements")
        .select("*")
        .or(`level.eq.${sessionData.level},level.is.null`)
        .order("created_at", { ascending: false });

      setAnnouncements(data || []);

      // Mark as read in localStorage
      if (data && data.length > 0) {
        const readIds = data.map((a) => a.id);
        localStorage.setItem(
          `tda_read_announcements_${sessionData.id}`,
          JSON.stringify(readIds)
        );
      }

      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  // Filter
  const filteredAnnouncements = announcements.filter((a) => {
    if (filter === "important") return a.is_important;
    return true;
  });

  const importantCount = announcements.filter((a) => a.is_important).length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          📢 Announcements
        </h1>
        <p className="text-gray-600 text-sm">
          Stay updated with news from Triumphant Disciples Academy
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Total Announcements
          </p>
          <p className="text-2xl font-bold text-brand-purple-900">
            {announcements.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-red-200 shadow-md">
          <p className="text-xs text-red-600 uppercase font-semibold mb-1">
            Important
          </p>
          <p className="text-2xl font-bold text-red-600">{importantCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            filter === "all"
              ? "bg-brand-purple-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
          }`}
        >
          📋 All ({announcements.length})
        </button>
        <button
          onClick={() => setFilter("important")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            filter === "important"
              ? "bg-red-500 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
          }`}
        >
          🚨 Important ({importantCount})
        </button>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
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
                d="M10.34 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            {filter === "important"
              ? "No important announcements"
              : "No announcements yet"}
          </h3>
          <p className="text-gray-500">
            Check back later for school updates and news
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map((announcement) => {
            const isExpanded = expandedId === announcement.id;

            return (
              <div
                key={announcement.id}
                className={`bg-white rounded-2xl border-2 shadow-md hover:shadow-lg transition-all overflow-hidden ${
                  announcement.is_important
                    ? "border-red-200 hover:border-red-300"
                    : "border-gray-100 hover:border-brand-purple-300"
                }`}
              >
                {/* Card Header (always visible) */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : announcement.id)
                  }
                  className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                        announcement.is_important
                          ? "bg-red-100 text-red-600"
                          : "bg-brand-purple-100 text-brand-purple-600"
                      }`}
                    >
                      {announcement.is_important ? "🚨" : "📢"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {announcement.is_important && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest">
                                Important
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatDate(announcement.created_at)}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-brand-purple-900 text-base md:text-lg leading-tight">
                            {announcement.title}
                          </h3>
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
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>

                      {/* Preview text (when collapsed) */}
                      {!isExpanded && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {announcement.body}
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pl-20">
                    <div
                      className={`rounded-2xl p-4 ${
                        announcement.is_important
                          ? "bg-red-50 border-2 border-red-100"
                          : "bg-brand-purple-50 border-2 border-brand-purple-100"
                      }`}
                    >
                      {/* Full body */}
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">
                        {announcement.body}
                      </p>

                      {/* Full timestamp */}
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
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

      {/* Info Note */}
      <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 text-brand-purple-900">
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
          <div>
            <p className="font-bold text-brand-purple-900 mb-1">
              💡 About Announcements
            </p>
            <ul className="text-brand-purple-700 text-sm space-y-1 list-disc pl-4">
              <li>Announcements are posted by your school administrator</li>
              <li>
                <strong>Important</strong> announcements are highlighted in red
              </li>
              <li>Click any announcement to read the full message</li>
              <li>Check regularly for school updates and news</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}