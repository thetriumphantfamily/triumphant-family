// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER SERMONS PAGE — Watch sermons right inside the portal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

export default function MemberSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

  useEffect(() => { loadSermons(); }, []);

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

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading sermons...</p></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">🎬 Sermons</h1>
        <p className="text-gray-600 text-sm">Watch powerful messages from Prophet Olayiwole Ogunsola</p>
      </div>

      {/* Selected Sermon Player */}
      {selectedSermon && (() => {
        const youtubeId = extractYouTubeId(selectedSermon.youtube_url);
        const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1` : null;

        return (
          <div className="bg-white rounded-3xl border-2 border-brand-gold-400/40 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            {embedUrl ? (
              <div className="aspect-video bg-black">
                <iframe
                  src={embedUrl}
                  title={selectedSermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-video bg-brand-purple-950 flex items-center justify-center">
                <p className="text-white">⚠️ Video not available</p>
              </div>
            )}

            <div className="p-5">
              <h2 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">{selectedSermon.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {selectedSermon.preacher} • {formatDate(selectedSermon.sermon_date)}
              </p>
              {selectedSermon.description && (
                <p className="text-gray-700 text-sm leading-relaxed">{selectedSermon.description}</p>
              )}
              <button
                onClick={() => setSelectedSermon(null)}
                className="mt-4 inline-flex items-center gap-2 text-brand-purple-600 hover:text-brand-purple-700 font-bold text-sm"
              >
                ← Back to sermon list
              </button>
            </div>
          </div>
        );
      })()}

      {/* Sermons Grid */}
      {sermons.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No sermons yet</h3>
          <p className="text-gray-500">Sermons will appear here once uploaded</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sermons.map((sermon) => {
            const thumbnail = sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url);

            return (
              <button
                key={sermon.id}
                onClick={() => setSelectedSermon(sermon)}
                className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-brand-gold-400 transition-all text-left group cursor-pointer"
              >
                <div className="relative aspect-video bg-brand-purple-900 overflow-hidden">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnail} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-14 h-14 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand-purple-900/60">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                      <svg className="w-7 h-7 text-brand-purple-900 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>

                  {sermon.is_featured && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-gold-400 text-brand-purple-900 text-[10px] font-bold">⭐ Featured</div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-heading font-bold text-brand-purple-900 text-sm mb-1 line-clamp-2 group-hover:text-brand-gold-600 transition-colors">{sermon.title}</h3>
                  <p className="text-xs text-gray-500">{sermon.preacher} • {formatDate(sermon.sermon_date)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}