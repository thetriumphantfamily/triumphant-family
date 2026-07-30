// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER DEVOTIONAL CLIENT — Daily devotional from Pastor
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Devotional {
  id: string;
  title: string;
  scripture: string;
  body: string;
  prayer_point: string | null;
  confession: string | null;
  publish_date: string;
  author: string;
  created_at: string;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function MemberDevotionalClient() {
  const [todayDevo, setTodayDevo] = useState<Devotional | null>(null);
  const [pastDevos, setPastDevos] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingDevo, setViewingDevo] = useState<Devotional | null>(null);

  useEffect(() => { loadDevotionals(); }, []);

  const loadDevotionals = async () => {
    try {
      const supabase = createClient();
      const today = new Date().toISOString().split("T")[0];

      const { data: todayData } = await supabase
        .from("tfam_devotionals")
        .select("*")
        .eq("publish_date", today)
        .eq("is_published", true)
        .single();

      if (todayData) setTodayDevo(todayData);

      const { data: pastData } = await supabase
        .from("tfam_devotionals")
        .select("*")
        .eq("is_published", true)
        .lt("publish_date", today)
        .order("publish_date", { ascending: false })
        .limit(14);

      setPastDevos(pastData || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const displayDevo = viewingDevo || todayDevo;

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading devotional...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">📖 Daily Devotional</h1>
        <p className="text-gray-600 text-sm">A word from Prophet Olayiwole Ogunsola</p>
      </div>

      {/* Today's / Selected Devotional */}
      {displayDevo ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
            <div className="bg-brand-gold-50 border-b-2 border-brand-gold-100 p-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📖</span>
                <div>
                  <p className="text-xs text-brand-gold-600 uppercase tracking-widest font-semibold">
                    {viewingDevo ? formatDate(viewingDevo.publish_date) : "Today's Word"}
                  </p>
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">{displayDevo.title}</h2>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Scripture */}
              <div className="bg-brand-purple-50 rounded-xl p-4 border-2 border-brand-purple-100">
                <p className="text-xs font-bold text-brand-purple-900 uppercase tracking-widest mb-2">📜 Scripture</p>
                <p className="text-brand-purple-800 italic font-medium">{displayDevo.scripture}</p>
              </div>

              {/* Body */}
              <div>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{displayDevo.body}</p>
              </div>

              {/* Prayer Point */}
              {displayDevo.prayer_point && (
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">🙏 Prayer Point</p>
                  <p className="text-blue-800 leading-relaxed">{displayDevo.prayer_point}</p>
                </div>
              )}

              {/* Confession */}
              {displayDevo.confession && (
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-100">
                  <p className="text-xs font-bold text-green-900 uppercase tracking-widest mb-2">💬 Confession</p>
                  <p className="text-green-800 leading-relaxed font-medium">{displayDevo.confession}</p>
                </div>
              )}

              {/* Author */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 italic">— {displayDevo.author}</p>
              </div>
            </div>
          </div>

          {viewingDevo && (
            <button onClick={() => setViewingDevo(null)} className="inline-flex items-center gap-2 text-brand-purple-600 hover:text-brand-purple-700 font-bold text-sm">
              ← Back to today&rsquo;s devotional
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No devotional for today</h3>
          <p className="text-gray-500">Check back tomorrow for a fresh word from the Lord</p>
        </div>
      )}

      {/* Past Devotionals */}
      {pastDevos.length > 0 && (
        <div>
          <h2 className="font-heading font-bold text-brand-purple-900 text-lg mb-4">📚 Previous Devotionals</h2>
          <div className="space-y-2">
            {pastDevos.map((devo) => (
              <button
                key={devo.id}
                onClick={() => setViewingDevo(devo)}
                className="w-full text-left bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-brand-gold-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-purple-900">{devo.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(devo.publish_date)} • {devo.scripture}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}