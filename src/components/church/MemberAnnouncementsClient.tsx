// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER ANNOUNCEMENTS CLIENT — View church announcements
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

function formatDate(d: string): string {
  const date = new Date(d);
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
}

export default function MemberAnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("tfam_member_announcements").select("*").order("created_at", { ascending: false });
      setAnnouncements(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading announcements...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">📢 Church Announcements</h1>
        <p className="text-gray-600 text-sm">Stay updated with church news and notices</p>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">📢</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No announcements yet</h3>
          <p className="text-gray-500">Church announcements will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const isExpanded = expandedId === a.id;
            return (
              <div key={a.id} className={`bg-white rounded-2xl border-2 shadow-md overflow-hidden ${a.is_important ? "border-red-200" : "border-gray-100"}`}>
                <button onClick={() => setExpandedId(isExpanded ? null : a.id)} className="w-full text-left p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${a.is_important ? "bg-red-100 text-red-600" : "bg-brand-purple-100 text-brand-purple-600"}`}>
                      {a.is_important ? "🚨" : "📢"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {a.is_important && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase">Important</span>}
                        <span className="text-xs text-gray-500">{formatDate(a.created_at)}</span>
                      </div>
                      <h3 className="font-heading font-bold text-brand-purple-900 text-base leading-tight">{a.title}</h3>
                      {!isExpanded && <p className="text-gray-600 text-sm line-clamp-2 mt-1">{a.body}</p>}
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pl-20">
                    <div className={`rounded-2xl p-4 ${a.is_important ? "bg-red-50 border-2 border-red-100" : "bg-brand-purple-50 border-2 border-brand-purple-100"}`}>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">{a.body}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}