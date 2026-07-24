// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FEATURED SERMON — Big embedded player at the top of sermons page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";

// Extract YouTube video ID from ANY URL format
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

// Format date nicely
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function FeaturedSermon() {
  const supabase = await createClient();

  // Get the FEATURED sermon (or latest if none featured)
  const { data: sermon } = await supabase
    .from("sermons")
    .select("id, title, description, preacher, sermon_date, youtube_url, is_featured")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!sermon) return null;

  const youtubeId = extractYouTubeId(sermon.youtube_url);
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`
    : null;

  // Only show if we have a valid YouTube URL
  if (!embedUrl) return null;

  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              {sermon.is_featured ? "⭐ Featured Sermon" : "🔥 Latest Sermon"}
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Watch{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Now
            </span>
          </h2>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Featured Sermon Card */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl overflow-hidden border-2 border-brand-gold-400/40 shadow-2xl">
            {/* Gold top bar */}
            <div className="h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            {/* Video Player */}
            <div className="aspect-video bg-black">
              <iframe
                src={embedUrl}
                title={sermon.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Info Section */}
            <div className="p-6 md:p-8">
              {/* Title */}
              <h3 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3">
                {sermon.title}
              </h3>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-brand-gold-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <span className="font-semibold">{sermon.preacher}</span>
                </div>

                <div className="flex items-center gap-2 text-brand-purple-100">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
                    />
                  </svg>
                  <span>{formatDate(sermon.sermon_date)}</span>
                </div>
              </div>

              {/* Description */}
              {sermon.description && (
                <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
                  {sermon.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}