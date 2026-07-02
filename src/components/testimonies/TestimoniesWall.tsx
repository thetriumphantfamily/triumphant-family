// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIES WALL — Public grid of approved testimonies
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  healing: { label: "Healing", emoji: "🙏" },
  breakthrough: { label: "Breakthrough", emoji: "⚡" },
  salvation: { label: "Salvation", emoji: "✝️" },
  marriage: { label: "Marriage", emoji: "💍" },
  family: { label: "Family", emoji: "👨‍👩‍👧‍👦" },
  finance: { label: "Finance", emoji: "💰" },
  career: { label: "Career", emoji: "💼" },
  deliverance: { label: "Deliverance", emoji: "🕊️" },
  thanksgiving: { label: "Thanksgiving", emoji: "🎉" },
  other: { label: "Other", emoji: "📖" },
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

  if (approvedTestimonies.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
              <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
                Testimony Wall
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-purple-900 mb-4">
              Be The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                First to Share
              </span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8">
              No testimonies have been shared yet. Be the first to encourage
              others with what God has done in your life!
            </p>
            <a
              href="#share-testimony"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-500 hover:to-brand-gold-600 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
            >
              🎉 Share Your Testimony
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
            <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
              Testimony Wall
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-4">
            Miracles &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Breakthroughs
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            Read what God is doing in the lives of our members. Let their
            stories build your faith!
          </p>
        </div>

        {/* Testimonies grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedTestimonies.map((t) => {
            const category = t.category
              ? CATEGORY_LABELS[t.category] || CATEGORY_LABELS.other
              : null;

            return (
              <div
                key={t.id}
                className={`relative rounded-2xl p-6 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 text-white shadow-xl hover:shadow-2xl border-2 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  t.is_featured
                    ? "border-brand-gold-400"
                    : "border-transparent hover:border-brand-gold-400/40"
                }`}
              >
                {/* Decorative blobs */}
                <div className="absolute top-[-30%] right-[-20%] w-48 h-48 rounded-full bg-brand-magenta-500/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-30%] left-[-20%] w-48 h-48 rounded-full bg-brand-gold-400/10 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Featured badge */}
                  {t.is_featured && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-gold-400 text-brand-purple-900 text-xs font-bold uppercase tracking-wider mb-3">
                      ⭐ Featured
                    </div>
                  )}

                  {/* Quote icon */}
                  <div className="text-brand-gold-400 text-4xl mb-3">
                    &ldquo;
                  </div>

                  {/* Testimony text */}
                  <p className="text-brand-purple-100 text-sm leading-relaxed italic mb-6 line-clamp-6">
                    {t.testimony_text}
                  </p>

                  {/* Video if present */}
                  {t.video_url && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-black">
                      <iframe
                        src={t.video_url}
                        title={`${t.full_name} testimony`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {/* Author info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    {/* Photo or Initials */}
                    {t.photo_url ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-gold-400 flex-shrink-0">
                        <Image
                          src={t.photo_url}
                          alt={t.full_name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 font-bold flex-shrink-0">
                        {t.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-white truncate">
                        {t.full_name}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        {category && (
                          <span className="text-brand-gold-300 text-xs font-semibold">
                            {category.emoji} {category.label}
                          </span>
                        )}
                        {t.location && (
                          <>
                            <span className="text-brand-purple-300 text-xs">
                              •
                            </span>
                            <span className="text-brand-purple-200 text-xs">
                              📍 {t.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}