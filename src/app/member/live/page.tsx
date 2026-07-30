// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER LIVE PAGE — Watch live stream right inside the portal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MemberLivePage() {
  const [isLive, setIsLive] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [preLiveMessage, setPreLiveMessage] = useState("The live stream will begin at our next service.");
  const [eventDate, setEventDate] = useState("Sunday 8:00 AM");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLiveSettings(); }, []);

  const loadLiveSettings = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "is_live_streaming",
          "youtube_live_url",
          "event_start_date",
          "pre_live_message",
        ]);

      const settingsMap: Record<string, string> = {};
      data?.forEach((s) => { settingsMap[s.key] = s.value; });

      setIsLive(settingsMap.is_live_streaming === "true");
      setYoutubeUrl((settingsMap.youtube_live_url || "").trim());
      setEventDate(settingsMap.event_start_date || "Sunday 8:00 AM");
      setPreLiveMessage(settingsMap.pre_live_message || "The live stream will begin at our next service.");
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const hasValidYoutube = youtubeUrl.startsWith("https://");

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading live stream...</p></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">📺 Watch Live</h1>
        <p className="text-gray-600 text-sm">Join our live services from your member portal</p>
      </div>

      {/* Status Banner */}
      {isLive ? (
        <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-2 border-brand-gold-400/60 shadow-lg">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-3 h-3 rounded-full bg-brand-gold-400 animate-ping" />
            <span className="relative w-3 h-3 rounded-full bg-brand-gold-400" />
          </div>
          <p className="text-white font-bold uppercase tracking-widest text-sm">🔴 We are LIVE right now!</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-gray-200 shadow-md mb-3">
            <svg className="w-5 h-5 text-brand-gold-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-brand-purple-900 font-semibold text-sm">📅 Next Service: {eventDate}</p>
          </div>
          <p className="text-gray-600 text-sm">{preLiveMessage}</p>
        </div>
      )}

      {/* Video Player */}
      {isLive && hasValidYoutube ? (
        <div className="bg-white rounded-3xl border-2 border-brand-gold-400/40 shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <span className="text-brand-purple-900 font-bold text-sm">Live Stream</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-600">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold uppercase">Live</span>
            </div>
          </div>

          <div className="aspect-video bg-black">
            <iframe
              src={youtubeUrl}
              title="Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="aspect-video flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-5">
                <svg className="w-10 h-10 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Stream Offline</h3>
              <p className="text-brand-purple-100 text-sm mb-4 max-w-md mx-auto">
                We go live during our services. Check back at our next service time.
              </p>
              <p className="text-brand-gold-400 italic text-base font-medium">
                Pray with us. Triumph with us.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Service Schedule */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
        <div className="bg-brand-purple-50 border-b-2 border-brand-purple-100 p-5">
          <h2 className="font-heading text-lg font-bold text-brand-purple-900 flex items-center gap-2">
            <span className="text-2xl">🕐</span> Service Schedule
          </h2>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="font-bold text-brand-purple-900">Sunday Service</span>
            <span className="text-brand-gold-600 font-bold">8:00 AM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="font-bold text-brand-purple-900">Wednesday Service</span>
            <span className="text-brand-gold-600 font-bold">9:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}