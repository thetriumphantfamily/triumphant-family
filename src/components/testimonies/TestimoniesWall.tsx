// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIES WALL — Book page style + white CTAs + tight spacing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  healing:      { label: "Healing",      emoji: "🙏" },
  breakthrough: { label: "Breakthrough", emoji: "⚡" },
  salvation:    { label: "Salvation",    emoji: "✝️" },
  marriage:     { label: "Marriage",     emoji: "💍" },
  family:       { label: "Family",       emoji: "👨‍👩‍👧‍👦" },
  finance:      { label: "Finance",      emoji: "💰" },
  career:       { label: "Career",       emoji: "💼" },
  deliverance:  { label: "Deliverance",  emoji: "🕊️" },
  thanksgiving: { label: "Thanksgiving", emoji: "🎉" },
  other:        { label: "Other",        emoji: "📖" },
};

const ICON_3D_STYLE = {
  color: "#ffffff",
  filter: "drop-shadow(0 2px 0 #e0e0e0) drop-shadow(0 3px 0 #cccccc) drop-shadow(0 4px 6px rgba(0,0,0,0.4)) drop-shadow(0 6px 15px rgba(255,255,255,0.15))",
};

export default async function TestimoniesWall() {
  const supabase = await createClient();

  const { data: testimonies } = await supabase
    .from("testimonies")
    .select("*")
    .eq("is_approved", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  const approvedTestimonies = testimonies || [];

  // EMPTY STATE
  if (approvedTestimonies.length === 0) {
    return (
      <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
        <div className="relative z-10 container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-8 lg:p-10 border-2 border-brand-gold-400/40 text-center overflow-hidden">

              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Badge */}
              <div className="flex justify-center mb-5">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                  <span className="text-white font-bold text-xs uppercase tracking-widest">
                    Testimony Wall
                  </span>
                </div>
              </div>

              {/* Icon — WHITE 3D no bg box */}
              <div className="flex justify-center mb-4" style={ICON_3D_STYLE}>
                <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
              </div>

              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mb-3">
                Be The{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                  First to Share
                </span>
              </h2>

              <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed mb-6 max-w-md mx-auto">
                No testimonies have been shared yet. Be the first to encourage
                others with what God has done in your life!
              </p>

              {/* CTA — WHITE gradient */}
              <a
                href="#share-testimony"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                🎉 Share Your Testimony
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Testimony Wall
            </span>
          </div>
        </div>

        {/* Heading — WHITE gradient */}
        <div className="text-center mb-6 lg:mb-8 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Miracles &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
              Breakthroughs
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            Read what God is doing in the lives of our members. Let their
            stories build your faith!
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Book page style cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {approvedTestimonies.map((t) => {
            const category = t.category
              ? CATEGORY_LABELS[t.category] || CATEGORY_LABELS.other
              : null;

            return (
              <div
                key={t.id}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col ${
                  t.is_featured ? "ring-4 ring-brand-gold-400/60" : ""
                }`}
                style={{
                  background: "linear-gradient(135deg, #faf6ec 0%, #f5eddc 100%)",
                }}
              >
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-gold-400 via-brand-gold-500 to-brand-gold-400" />

                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, #6B1F8A 0px, #6B1F8A 1px, transparent 1px, transparent 24px)",
                  }}
                />

                <div className="absolute top-4 left-4 w-8 h-8 opacity-40 pointer-events-none">
                  <svg viewBox="0 0 32 32" className="w-full h-full text-brand-gold-500" fill="currentColor">
                    <path d="M2 2 L14 2 L14 4 L4 4 L4 14 L2 14 Z" />
                    <circle cx="8" cy="8" r="2" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 opacity-40 pointer-events-none scale-x-[-1]">
                  <svg viewBox="0 0 32 32" className="w-full h-full text-brand-gold-500" fill="currentColor">
                    <path d="M2 2 L14 2 L14 4 L4 4 L4 14 L2 14 Z" />
                    <circle cx="8" cy="8" r="2" />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col flex-1 p-6 pt-8">

                  {t.is_featured && (
                    <div className="absolute top-5 right-6 rotate-12 pointer-events-none z-20">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 flex items-center justify-center border-2 border-brand-gold-300">
                          <div className="text-center">
                            <div className="text-[8px] text-brand-purple-900 font-bold uppercase tracking-wider leading-none">
                              God&rsquo;s
                            </div>
                            <div className="text-[10px] text-brand-purple-900 font-heading font-bold italic leading-none mt-0.5">
                              Grace
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-2">
                    <svg className="w-14 h-14 text-brand-purple-900/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  <p
                    className="text-brand-purple-900 text-sm leading-relaxed italic mb-4 line-clamp-7 flex-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    &ldquo;{t.testimony_text}&rdquo;
                  </p>

                  {t.video_url && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black border-2 border-brand-purple-900/20">
                      <iframe
                        src={t.video_url}
                        title={`${t.full_name} testimony`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  <div className="relative pt-4 mt-auto">
                    <div className="absolute top-0 left-0 right-1/3 h-px bg-gradient-to-r from-brand-purple-900/50 to-transparent" />

                    <div className="flex items-center gap-3">
                      {t.photo_url ? (
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-brand-gold-500 flex-shrink-0">
                          <Image
                            src={t.photo_url}
                            alt={t.full_name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-purple-700 to-brand-purple-900 flex items-center justify-center text-brand-gold-400 font-bold text-sm flex-shrink-0 border-2 border-brand-gold-500">
                          {t.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-heading font-bold text-brand-purple-900 text-base truncate italic"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          — {t.full_name}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          {category && (
                            <span className="text-brand-purple-700 text-[10px] font-semibold">
                              {category.emoji} {category.label}
                            </span>
                          )}
                          {t.location && (
                            <>
                              <span className="text-brand-purple-500 text-[10px]">•</span>
                              <span className="text-brand-purple-600 text-[10px]">
                                📍 {t.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-500/60 via-brand-gold-400/60 to-brand-gold-500/60" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}