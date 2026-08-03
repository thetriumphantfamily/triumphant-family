// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER LIVE — Dashboard pattern (purple cards, white text)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberLiveClient() {
  const [isLive, setIsLive] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [preLiveMessage, setPreLiveMessage] = useState("The live stream will begin at our next service.");
  const [eventDate, setEventDate] = useState("Sunday 8:00 AM");
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    loadLiveSettings();
    loadMember();
  }, []);

  const loadMember = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) { setMemberName(parsed.full_name.split(" ")[0]); break; }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }
  };

  const loadLiveSettings = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["is_live_streaming", "youtube_live_url", "event_start_date", "pre_live_message"]);

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

  if (loading) return <LoadingScreen message="Loading live stream..." />;

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? "bg-red-500" : "bg-brand-gold-400"} animate-pulse`} />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              {isLive ? "🔴 LIVE NOW" : "Live Stream"}
            </span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">{getGreeting()}{memberName ? `, ${memberName}` : ""}!</p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Watch Live</h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Join our live services from your portal</p>
        </div>
      </div>

      {/* Live Status */}
      {isLive ? (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-2 border-brand-gold-400/60 p-4 shadow-xl">
          <div className="flex items-center justify-center gap-3">
            <span className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full bg-brand-gold-400 animate-ping" />
              <span className="relative w-3 h-3 rounded-full bg-brand-gold-400" />
            </span>
            <p className="text-white font-bold uppercase tracking-widest text-sm">🔴 We are LIVE right now!</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <p className="text-white font-bold text-sm mb-1">📅 Next Service: {eventDate}</p>
          <p className="text-brand-purple-200 text-sm">{preLiveMessage}</p>
        </div>
      )}

      {/* Video Player */}
      {isLive && hasValidYoutube ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="flex items-center justify-between p-4 border-b border-brand-gold-400/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm">Live Stream</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-600">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold uppercase">Live</span>
            </div>
          </div>

          <div className="aspect-video bg-black">
            <iframe src={youtubeUrl} title="Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen className="w-full h-full" />
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="aspect-video flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-6xl mb-5">📺</div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Stream Offline</h3>
              <p className="text-brand-purple-200 text-sm mb-4 max-w-md mx-auto">
                We go live during our services. Check back at our next service time.
              </p>
              <p className="text-brand-purple-300 italic text-base font-medium">
                Pray with us. Triumph with us.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Service Schedule */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h3 className="font-heading font-bold text-white mb-3">⏰ Service Schedule</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-brand-purple-200">Sunday Worship Service</span>
            <span className="font-bold text-white">8:00 AM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-brand-purple-200">Wednesday Bible Study</span>
            <span className="font-bold text-white">9:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}