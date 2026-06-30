// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SINGLE SERMON PAGE — Embedded YouTube player + full details
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { notFound } from "next/navigation";
import Link         from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Badge          from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

// ── YouTube embed helper ──
function getYouTubeEmbedUrl(url: string): string | null {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
}

// ── Generate metadata for SEO ──
type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: sermon } = await supabase
    .from("sermons")
    .select("title, description, preacher, scripture")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!sermon) {
    return { title: "Sermon Not Found" };
  }

  return {
    title:       `${sermon.title} | The Triumphant Family`,
    description: sermon.description || `${sermon.title} by ${sermon.preacher}`,
    openGraph: {
      title:       sermon.title,
      description: sermon.description || sermon.scripture || "",
      type:        "video.other",
    },
  };
}

// ── Page component ──
export default async function SermonDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch sermon
  const { data: sermon } = await supabase
    .from("sermons")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!sermon) {
    notFound();
  }

  // Fetch related sermons (same series or latest)
  const { data: related } = await supabase
    .from("sermons")
    .select("id, title, slug, preacher, sermon_date, scripture, youtube_url, thumbnail_url")
    .eq("is_published", true)
    .neq("id", sermon.id)
    .order("sermon_date", { ascending: false })
    .limit(3);

  const embedUrl = getYouTubeEmbedUrl(sermon.youtube_url || "");

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* ━━━ Top section: video + meta ━━━ */}
      <section className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 pt-10 pb-16">
        <div className="container-custom">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-brand-purple-200 mb-6">
            <Link href="/" className="hover:text-brand-gold-400 transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/sermons" className="hover:text-brand-gold-400 transition-colors">Sermons</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-brand-gold-400 font-semibold truncate">{sermon.title}</span>
          </nav>

          <div className="max-w-5xl mx-auto">

            {/* Video player */}
            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-8">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={sermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-purple-700 to-brand-violet-900">
                  <div className="text-center text-white p-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <p className="text-lg">Video coming soon</p>
                  </div>
                </div>
              )}
            </div>

            {/* Series + duration */}
            <div className="flex items-center flex-wrap gap-3 mb-4">
              {sermon.series && (
                <span className="px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold uppercase tracking-wider">
                  {sermon.series}
                </span>
              )}
              {sermon.duration && (
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
                  ⏱ {sermon.duration}
                </span>
              )}
              {sermon.views > 0 && (
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
                  👁 {sermon.views.toLocaleString()} views
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
              {sermon.title}
            </h1>

            {/* Scripture */}
            {sermon.scripture && (
              <p className="text-brand-gold-400 text-lg font-semibold italic mb-4">
                📖 {sermon.scripture}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center flex-wrap gap-4 text-sm text-brand-purple-200">
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
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Description section ━━━ */}
      {sermon.description && (
        <section className="py-16 bg-white">
          <div className="container-custom max-w-4xl">
            <h2 className="font-heading text-2xl font-bold text-brand-purple-900 mb-6">
              About This Sermon
            </h2>
            <div className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-line">
              {sermon.description}
            </div>

            {/* Tags */}
            {sermon.tags && sermon.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {sermon.tags.map((tag: string) => (
                    <Badge key={tag} variant="purple" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ━━━ Related sermons ━━━ */}
      {related && related.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom max-w-7xl">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-8 text-center">
              More Sermons
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((s) => {
                const thumb = s.thumbnail_url ||
                  (s.youtube_url ? `https://img.youtube.com/vi/${s.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]}/hqdefault.jpg` : null);

                return (
                  <Link
                    key={s.id}
                    href={`/sermons/${s.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative w-full aspect-video bg-brand-purple-100">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-purple-600 to-brand-purple-800">
                          <svg className="w-12 h-12 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-brand-purple-900 mb-1 line-clamp-2 group-hover:text-brand-purple-600 transition-colors">
                        {s.title}
                      </h3>
                      {s.scripture && (
                        <p className="text-brand-gold-600 text-xs font-semibold italic mb-2">📖 {s.scripture}</p>
                      )}
                      <p className="text-xs text-gray-400">{formatDate(s.sermon_date)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/sermons"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-brand-purple-200 text-brand-purple-700 font-semibold hover:bg-brand-purple-50 transition-all duration-300"
              >
                ← Back to All Sermons
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}