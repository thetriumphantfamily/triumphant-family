// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FEATURED SERMON — Highlighted top sermon (large display)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient }   from "@/lib/supabase/server";
import Badge              from "@/components/ui/Badge";
import { formatDate }     from "@/lib/utils";

// ── YouTube thumbnail helper ──
function getYouTubeThumbnail(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
}

export default async function FeaturedSermon() {
  const supabase = await createClient();

  // Get the latest featured sermon, or fall back to latest sermon
  const { data: sermon } = await supabase
    .from("sermons")
    .select("id, title, slug, description, preacher, sermon_date, scripture, series, youtube_url, thumbnail_url, views, duration")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("sermon_date", { ascending: false })
    .limit(1)
    .single();

  if (!sermon) return null;

  const thumbnail = sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url || "") || null;

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-brand-gold-400 text-brand-purple-900 text-xs font-bold uppercase tracking-wider">
              ⭐ Featured
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-brand-gold-400 to-transparent" />
          </div>

          {/* Featured card */}
          <Link
            href={`/sermons/${sermon.slug}`}
            className="group block bg-gradient-to-br from-brand-purple-900 via-brand-purple-800 to-brand-violet-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-brand-lg transition-all duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Thumbnail */}
              <div className="relative w-full aspect-video lg:aspect-auto lg:min-h-[400px] overflow-hidden">
                {thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnail}
                    alt={sermon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-purple-600 to-brand-purple-800">
                    <svg className="w-24 h-24 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <div className="w-20 h-20 rounded-full bg-brand-gold-400 flex items-center justify-center shadow-gold-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-brand-purple-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Duration badge */}
                {sermon.duration && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {sermon.duration}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-8 md:p-12 text-white flex flex-col justify-center">

                {/* Series badge */}
                {sermon.series && (
                  <span className="inline-block w-fit px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold uppercase tracking-wider mb-4">
                    {sermon.series}
                  </span>
                )}

                {/* Title */}
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight group-hover:text-brand-gold-300 transition-colors duration-300">
                  {sermon.title}
                </h2>

                {/* Scripture */}
                {sermon.scripture && (
                  <p className="text-brand-gold-400 text-base font-semibold italic mb-4">
                    📖 {sermon.scripture}
                  </p>
                )}

                {/* Description */}
                {sermon.description && (
                  <p className="text-brand-purple-200 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                    {sermon.description}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-brand-purple-200 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span>{sermon.preacher}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>{formatDate(sermon.sermon_date)}</span>
                  </div>
                  {sermon.views > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clipRule="evenodd"/>
                        </svg>
                        <span>{sermon.views.toLocaleString()} views</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Watch button */}
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold group-hover:shadow-gold-lg group-hover:scale-105 transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch Now
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}