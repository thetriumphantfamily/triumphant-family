// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS PREVIEW — Same gradient on section + cards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

function getYouTubeThumbnail(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}

export default async function SermonsPreview() {
  const supabase = await createClient();

  const { data: sermons } = await supabase
    .from("sermons")
    .select("id, title, slug, preacher, sermon_date, scripture, series, youtube_url, thumbnail_url, views")
    .eq("is_published", true)
    .order("sermon_date", { ascending: false })
    .limit(3);

  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              The Word
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8 lg:mb-10 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Latest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Sermons
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Feed your spirit with anointed messages from Prophet Olayiwole Ogunsola.
          </p>

          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Empty state */}
        {(!sermons || sermons.length === 0) && (
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 rounded-3xl p-10 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-4">
              <svg className="w-10 h-10 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-2">
              Sermons Coming Soon
            </h3>
            <p className="text-brand-purple-100 mb-6">
              We are uploading our sermon library. Check back soon for anointed messages.
            </p>
            <a
              href="https://www.youtube.com/PastorOlayiwoleTriumphant"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Subscribe on YouTube
            </a>
          </div>
        )}

        {/* Sermon cards — SAME GRADIENT + GOLD BORDER */}
        {sermons && sermons.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
              {sermons.map((sermon) => {
                const thumbnail = sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url || "") || null;
                return (
                  <Link
                    key={sermon.id}
                    href={`/sermons/${sermon.slug}`}
                    className="group bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl overflow-hidden border-2 border-brand-gold-400/40 hover:border-brand-gold-400 transition-all duration-300 hover:-translate-y-1 relative"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 z-10" />

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
                          <svg className="w-16 h-16 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-purple-900/60">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                          <svg className="w-8 h-8 text-brand-purple-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {sermon.views > 0 && (
                        <div className="absolute bottom-2 right-2 bg-brand-purple-900/80 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-brand-gold-400/40">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {sermon.views.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="p-5 lg:p-6">
                      {sermon.series && (
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold uppercase tracking-wider mb-3">
                          {sermon.series}
                        </span>
                      )}
                      <h3 className="font-heading text-lg lg:text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-gold-400 transition-colors">
                        {sermon.title}
                      </h3>
                      {sermon.scripture && (
                        <p className="text-brand-gold-400 text-sm font-semibold mb-3 italic">
                          📖 {sermon.scripture}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-brand-purple-200 pt-3 border-t border-brand-gold-400/30">
                        <span className="font-medium">{sermon.preacher}</span>
                        <span>{formatDate(sermon.sermon_date)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Link
                href="/sermons"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                View All Sermons
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
}