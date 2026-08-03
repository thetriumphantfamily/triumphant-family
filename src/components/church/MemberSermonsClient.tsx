// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER SERMONS — Dashboard pattern (purple cards, white text)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface Sermon {
  id: string;
  title: string;
  description: string | null;
  preacher: string | null;
  sermon_date: string;
  youtube_url: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
}

function extractYouTubeId(url: string | null): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/live\/([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getYouTubeThumbnail(url: string | null): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberSermonsClient() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    loadSermons();
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

  const loadSermons = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("sermons")
        .select("id, title, description, preacher, sermon_date, youtube_url, thumbnail_url, is_featured")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      setSermons(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  if (loading) return <LoadingScreen message="Loading sermons..." />;

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Sermons</span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">{getGreeting()}{memberName ? `, ${memberName}` : ""}!</p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Watch Sermons</h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Powerful messages from Prophet Olayiwole Ogunsola</p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{sermons.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
          </div>
        </div>
      </div>

      {selectedSermon && (() => {
        const youtubeId = extractYouTubeId(selectedSermon.youtube_url);
        const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1` : null;

        return (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            {embedUrl ? (
              <div className="aspect-video bg-black">
                <iframe src={embedUrl} title={selectedSermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen className="w-full h-full" />
              </div>
            ) : (
              <div className="aspect-video bg-brand-purple-950 flex items-center justify-center">
                <p className="text-white">⚠️ Video not available</p>
              </div>
            )}
            <div className="p-5">
              <h2 className="font-heading text-xl font-bold text-white mb-2">{selectedSermon.title}</h2>
              <p className="text-brand-purple-200 text-sm mb-2">{selectedSermon.preacher} • {formatDate(selectedSermon.sermon_date)}</p>
              {selectedSermon.description && <p className="text-white/80 text-sm leading-relaxed text-justify">{selectedSermon.description}</p>}
              <button onClick={() => setSelectedSermon(null)} className="mt-4 inline-flex items-center gap-2 text-brand-gold-400 hover:text-white font-bold text-sm transition-colors">← Back to all sermons</button>
            </div>
          </div>
        );
      })()}

      {sermons.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🎙️</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">No Sermons Yet</h2>
          <p className="text-brand-purple-200 text-sm">Sermons will be uploaded soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sermons.map((sermon) => {
            const thumbnail = sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url);
            return (
              <button key={sermon.id} onClick={() => setSelectedSermon(sermon)}
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-left">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                {thumbnail && (
                  <div className="relative aspect-video bg-brand-purple-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbnail} alt={sermon.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-brand-gold-400/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-brand-purple-900 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    {sermon.is_featured && (
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-brand-gold-400 text-brand-purple-900 text-xs font-black">⭐ Featured</div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <p className="font-black text-white text-base mb-1 truncate">{sermon.title}</p>
                  <p className="text-brand-purple-200 text-xs">{sermon.preacher} • {formatDate(sermon.sermon_date)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}