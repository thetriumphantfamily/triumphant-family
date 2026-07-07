// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY PREVIEW — Clean theme, no blobs, gold borders
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

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
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

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

        {/* Heading */}
        <div className="text-center mb-8 lg:mb-10 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Precious{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {items.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-brand-gold-400/40 hover:border-brand-gold-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <Image
                src={item.image_url}
                alt={item.title || "Gallery"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-900/80 via-brand-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {item.title && (
                <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs lg:text-sm font-bold truncate" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    {item.title}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* View all CTA */}
        <div className="flex justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            View Full Gallery
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}