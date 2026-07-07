// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIES SECTION — Clean theme (same gradient on section + cards)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getInitials, truncate } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  healing:      "🙌 Healing",
  breakthrough: "⚡ Breakthrough",
  salvation:    "✝ Salvation",
  marriage:     "💍 Marriage",
  family:       "👨‍👩‍👧 Family",
  finance:      "💰 Finance",
  career:       "📈 Career",
  deliverance:  "🔓 Deliverance",
  other:        "🙏 Testimony",
};

export default async function TestimoniesSection() {
  const supabase = await createClient();

  const { data: testimonies } = await supabase
    .from("testimonies")
    .select("id, full_name, location, testimony_text, category, photo_url")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (!testimonies || testimonies.length === 0) return null;

  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Badge — same gradient + gold border */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Testimonies
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8 lg:mb-10 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            God is Still{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Working Miracles
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Real stories of healing, breakthrough, and divine intervention from our Triumphant Family.
          </p>

          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Testimony cards — SAME GRADIENT + GOLD BORDER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testimonies.map((testimony) => (
            <div
              key={testimony.id}
              className="group bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 lg:p-7 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
            >
              {/* Gold top bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Gold quote mark */}
              <div className="text-brand-gold-400 text-5xl font-heading leading-none mb-3 select-none">
                &ldquo;
              </div>

              {/* Testimony text */}
              <p className="text-brand-purple-100 leading-relaxed text-sm lg:text-base flex-1 mb-5 italic">
                {truncate(testimony.testimony_text, 180)}
              </p>

              {/* Category badge */}
              {testimony.category && (
                <span className="inline-block px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold mb-5 w-fit">
                  {CATEGORY_LABELS[testimony.category] || "🙏 Testimony"}
                </span>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-brand-gold-400/30">
                {testimony.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={testimony.photo_url}
                    alt={testimony.full_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold-400/60"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-purple-900 text-sm font-bold">
                      {getInitials(testimony.full_name)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-white text-sm">{testimony.full_name}</p>
                  {testimony.location && (
                    <p className="text-brand-purple-200 text-xs">📍 {testimony.location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Share testimony CTA */}
        <div className="text-center">
          <p className="text-brand-gold-400 text-base md:text-lg lg:text-xl italic mb-4" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            Has God done something amazing in your life?
          </p>
          <Link
            href="/testimonies"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            Share Your Testimony
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}