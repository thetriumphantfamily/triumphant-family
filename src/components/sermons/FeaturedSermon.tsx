// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FEATURED SERMON — Highlighted top sermon (clean, gold theme)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

function getYouTubeThumbnail(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
}

export default async function FeaturedSermon() {
  const supabase = await createClient();

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
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              ⭐ Featured Sermon
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            This Week&apos;s{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Highlight
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            Don&apos;t miss this powerful message specially selected for you.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Featured card — same gradient + gold border */}
        <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl overflow-hidden border-2 border-brand-gold-400/40 hover:border-brand-gold-400 transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,199,44,0.25)] max-w-6xl mx-auto">

          {/* Gold top bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Thumbnail (left) */}
            <Link
              href={`/sermons/${sermon.slug}`}
              className="relative w-full aspect-video lg:aspect-auto lg:min-h-[400px] bg-brand-purple-900 overflow-hidden group/thumb"
            >
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnail}
                  alt={sermon.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-purple-700 to-brand-violet-900">
                  <svg className="w-24 h-24 text-brand-gold-400/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-900/80 via-brand-purple-900/20 to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center group-hover/thumb:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-brand-purple-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration */}
              {sermon.duration && (
                <div className="absolute bottom-3 right-3 bg-brand-purple-900/80 border border-brand-gold-400/40 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {sermon.duration}
                </div>
              )}

              {/* Views */}
              {sermon.views > 0 && (
                <div className="absolute bottom-3 left-3 bg-brand-purple-900/80 border border-brand-gold-400/40 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clipRule="evenodd" />
                  </svg>
                  {sermon.views.toLocaleString()} views
                </div>
              )}
            </Link>

            {/* Info (right) */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">

              {/* Series badge */}
              {sermon.series && (
                <span className="inline-block px-3 py-1 rounded-full bg-brand-gold-400/15 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                  {sermon.series}
                </span>
              )}

              {/* Title */}
              <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                {sermon.title}
              </h3>

              {/* Scripture */}
              {sermon.scripture && (
                <p className="text-brand-gold-400 text-sm md:text-base font-semibold italic mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z" />
                  </svg>
                  {sermon.scripture}
                </p>
              )}

              {/* Description */}
              {sermon.description && (
                <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 text-justify">
                  {sermon.description}
                </p>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-brand-purple-200 mb-6 pb-6 border-b border-brand-gold-400/30">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="font-semibold">{sermon.preacher}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
                  </svg>
                  {formatDate(sermon.sermon_date)}
                </span>
              </div>

              {/* CTA */}
              <Link
                href={`/sermons/${sermon.slug}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300 w-fit"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Sermon
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}