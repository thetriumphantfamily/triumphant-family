// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS LIST — Grid of all sermons (clean + polished)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

function getYouTubeThumbnail(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}

export default async function SermonsList() {
  const supabase = await createClient();

  const { data: sermons } = await supabase
    .from("sermons")
    .select("id, title, slug, description, preacher, sermon_date, scripture, series, youtube_url, thumbnail_url, views, duration")
    .eq("is_published", true)
    .order("sermon_date", { ascending: false });

  return (
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
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Empty state — themed card (visible on purple bg) */}
        {(!sermons || sermons.length === 0) && (
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-10 lg:p-12 border-2 border-brand-gold-400/40 text-center overflow-hidden">

              {/* Gold top bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Gold icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-5">
                <svg className="w-10 h-10 text-brand-purple-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-3">
                Sermon Library Being Built
              </h3>

              {/* Description */}
              <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
                Our sermon library is being populated. In the meantime, subscribe to
                our YouTube channel for the latest messages.
              </p>

              {/* CTA — GOLD GRADIENT */}
              <a
                href="https://www.youtube.com/PastorOlayiwoleTriumphant"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Visit YouTube Channel
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Sermons grid */}
        {sermons && sermons.length > 0 && (
          <>
            {/* Count */}
            <p className="text-center text-brand-purple-200 text-sm mb-8">
              Showing <strong className="text-brand-gold-400">{sermons.length}</strong>{" "}
              {sermons.length === 1 ? "sermon" : "sermons"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {sermons.map((sermon) => {
                const thumbnail = sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url || "") || null;
                return (
                  <Link
                    key={sermon.id}
                    href={`/sermons/${sermon.slug}`}
                    className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl overflow-hidden border border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
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
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                          <svg className="w-7 h-7 text-brand-purple-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {/* Duration */}
                      {sermon.duration && (
                        <div className="absolute bottom-2 right-2 bg-brand-purple-900/80 border border-brand-gold-400/40 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {sermon.duration}
                        </div>
                      )}

                      {/* Views */}
                      {sermon.views > 0 && (
                        <div className="absolute bottom-2 left-2 bg-brand-purple-900/80 border border-brand-gold-400/40 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clipRule="evenodd" />
                          </svg>
                          {sermon.views.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1">
                      {sermon.series && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-gold-400/15 border border-brand-gold-400/40 text-brand-gold-300 text-[10px] font-bold uppercase tracking-wider mb-3 w-fit">
                          {sermon.series}
                        </span>
                      )}

                      <h3 className="font-heading text-base lg:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-gold-400 transition-colors">
                        {sermon.title}
                      </h3>

                      {sermon.scripture && (
                        <p className="text-brand-gold-400 text-xs font-semibold italic mb-3 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z" />
                          </svg>
                          {sermon.scripture}
                        </p>
                      )}

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
                  </Link>
                );
              })}
            </div>
          </>
        )}

      </div>
    </section>
  );
}