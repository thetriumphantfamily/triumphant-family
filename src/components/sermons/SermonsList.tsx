// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMONS LIST — Grid of all published sermons
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient }   from "@/lib/supabase/server";
import SectionHeading     from "@/components/ui/SectionHeading";
import EmptyState         from "@/components/ui/EmptyState";
import Badge              from "@/components/ui/Badge";
import { formatDate }     from "@/lib/utils";

// ── YouTube thumbnail helper ──
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
    <section className="py-16 bg-gray-50">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-12">
          <SectionHeading
            badge="All Sermons"
            title={
              <>
                Complete{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Sermon Library
                </span>
              </>
            }
            subtitle="Browse our complete collection of sermons, teachings, and prophetic messages."
            withDivider
          />
        </div>

        {/* No sermons */}
        {(!sermons || sermons.length === 0) && (
          <EmptyState
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/>
              </svg>
            }
            title="Sermon Library Being Built"
            description="Our sermon library is being populated. In the meantime, subscribe to our YouTube channel for the latest messages."
            actionLabel="Visit YouTube Channel"
            actionHref="https://www.youtube.com/PastorOlayiwoleTriumphant"
          />
        )}

        {/* Sermons grid */}
        {sermons && sermons.length > 0 && (
          <>
            {/* Count */}
            <p className="text-center text-gray-500 text-sm mb-8">
              Showing <strong className="text-brand-purple-700">{sermons.length}</strong>{" "}
              {sermons.length === 1 ? "sermon" : "sermons"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {sermons.map((sermon) => {
                const thumbnail = sermon.thumbnail_url || getYouTubeThumbnail(sermon.youtube_url || "") || null;
                return (
                  <Link
                    key={sermon.id}
                    href={`/sermons/${sermon.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-video bg-brand-purple-100 overflow-hidden">
                      {thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbnail}
                          alt={sermon.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-purple-600 to-brand-purple-800">
                          <svg className="w-16 h-16 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      )}

                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-purple-900/40">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <svg className="w-7 h-7 text-brand-purple-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>

                      {/* Duration */}
                      {sermon.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                          {sermon.duration}
                        </div>
                      )}

                      {/* Views */}
                      {sermon.views > 0 && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clipRule="evenodd"/>
                          </svg>
                          {sermon.views.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6 flex flex-col flex-1">
                      {sermon.series && (
                        <Badge variant="purple" size="sm" className="mb-3 w-fit">
                          {sermon.series}
                        </Badge>
                      )}

                      <h3 className="font-heading text-lg font-bold text-brand-purple-900 mb-2 line-clamp-2 group-hover:text-brand-purple-600 transition-colors">
                        {sermon.title}
                      </h3>

                      {sermon.scripture && (
                        <p className="text-brand-gold-600 text-sm font-semibold italic mb-3">
                          📖 {sermon.scripture}
                        </p>
                      )}

                      {sermon.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                          {sermon.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 mt-auto">
                        <span className="truncate">{sermon.preacher}</span>
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