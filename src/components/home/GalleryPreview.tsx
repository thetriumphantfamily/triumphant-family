// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY PREVIEW — Tight spacing + white gradient + minimal gold
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_LABELS: Record<string, string> = {
  worship: "🎵 Worship",
  prayer: "🙏 Prayer",
  event: "📅 Event",
  ministry: "⛪ Ministry",
  outreach: "🌍 Outreach",
  service: "✨ Service",
  general: "📸 General",
};

export default async function GalleryPreview() {
  const supabase = await createClient();

  const { data: gallery } = await supabase
    .from("gallery")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .limit(8);

  const items = gallery || [];

  if (items.length === 0) return null;

  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Photo Gallery
            </span>
          </div>
        </div>

        {/* Heading — WHITE gradient */}
        <div className="text-center mb-6 lg:mb-8 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Precious{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
              Moments
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            A glimpse into the joy, worship, and encounters at The Triumphant
            Family Ministry.
          </p>

          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl overflow-hidden border border-brand-gold-400/40 hover:border-brand-gold-400 transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Photo */}
              <div className="relative aspect-square bg-brand-purple-950 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title || "Gallery"}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Category badge — WHITE (no gold) */}
                {item.category && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-purple-950/80 border border-white/20 text-white text-[10px] font-bold">
                    {CATEGORY_LABELS[item.category] || item.category}
                  </div>
                )}
              </div>

              {/* Title and description */}
              {(item.title || item.description) && (
                <div className="p-3">
                  {item.title && (
                    <h3 className="font-heading text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-brand-purple-100 text-xs leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* View all CTA — WHITE gradient */}
        <div className="flex justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            View Full Gallery
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}