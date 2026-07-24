// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS LIST — YouTube-style grid with embedded modal player
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import SermonModal from "./SermonModal";

interface Sermon {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  preacher: string | null;
  sermon_date: string;
  youtube_url: string | null;
  thumbnail_url: string | null;
  views: number;
  is_featured: boolean;
}

// Extract YouTube thumbnail from URL
function getYouTubeThumbnail(url: string | null): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/live\/([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }

  return null;
}

// Format date nicely
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SermonsList() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

  useEffect(() => {
    const fetchSermons = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("sermons")
        .select("id, title, slug, description, preacher, sermon_date, youtube_url, thumbnail_url, views, is_featured")
        .eq("is_published", true)
        .eq("is_featured", false) // Exclude featured (shown separately)
        .order("created_at", { ascending: false }); // Newest first

      setSermons(data || []);
      setLoading(false);
    };

    fetchSermons();
  }, []);

  return (
    <>
      <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
        <div className="relative z-10 container-custom">
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
              <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
                All Sermons
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
              Complete{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                Sermon Library
              </span>
            </h2>
            <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
              Browse our complete collection of sermons, teachings, and prophetic messages.
              Click any sermon to watch instantly.
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-10">
              <p className="text-brand-purple-200">Loading sermons...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && sermons.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-10 lg:p-12 border-2 border-brand-gold-400/40 text-center overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-5">
                  <svg className="w-10 h-10 text-brand-purple-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-3">
                  More Sermons Coming Soon
                </h3>

                <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                  We are adding more sermons to the library. Check back soon!
                </p>
              </div>
            </div>
          )}

          {/* Sermons grid */}
          {!loading && sermons.length > 0 && (
            <>
              {/* Count */}
              <p className="text-center text-brand-purple-200 text-sm mb-8">
                Showing <strong className="text-brand-gold-400">{sermons.length}</strong>{" "}
                {sermons.length === 1 ? "sermon" : "sermons"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
                {sermons.map((sermon) => {
                  const thumbnail = sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url);

                  return (
                    <button
                      key={sermon.id}
                      onClick={() => setSelectedSermon(sermon)}
                      className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl overflow-hidden border border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col text-left cursor-pointer"
                    >
                      {/* Gold top bar */}
                      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 z-10" />

                      {/* Thumbnail */}
                      <div className="relative w-full aspect-video bg-brand-purple-900 overflow-hidden">
                        {thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumbnail}
                            alt={sermon.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-purple-700 to-brand-purple-900">
                            <svg className="w-14 h-14 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}

                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-purple-900/60">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                            <svg className="w-8 h-8 text-brand-purple-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-heading text-base lg:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-gold-400 transition-colors">
                          {sermon.title}
                        </h3>

                        {sermon.description && (
                          <p className="text-brand-purple-100 text-xs lg:text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                            {sermon.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-brand-purple-200 pt-3 border-t border-brand-gold-400/30 mt-auto">
                          <span className="truncate font-medium">{sermon.preacher}</span>
                          <span>{formatDate(sermon.sermon_date)}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <SermonModal
        sermon={selectedSermon}
        onClose={() => setSelectedSermon(null)}
      />
    </>
  );
}