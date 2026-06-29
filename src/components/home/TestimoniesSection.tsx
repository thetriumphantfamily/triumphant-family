// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIES SECTION — Approved testimonies from Supabase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { createClient }            from "@/lib/supabase/server";
import SectionHeading              from "@/components/ui/SectionHeading";
import { getInitials, truncate }   from "@/lib/utils";

export default async function TestimoniesSection() {
  const supabase = await createClient();

  const { data: testimonies } = await supabase
    .from("testimonies")
    .select("id, full_name, location, testimony_text, category, photo_url")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (!testimonies || testimonies.length === 0) return null;

  const CATEGORY_LABELS: Record<string, string> = {
    healing:      "🙌 Healing",
    breakthrough: "⚡ Breakthrough",
    salvation:    "✝️ Salvation",
    marriage:     "💍 Marriage",
    family:       "👨‍👩‍👧 Family",
    finance:      "💰 Finance",
    career:       "📈 Career",
    deliverance:  "🔓 Deliverance",
    other:        "🙏 Testimony",
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">

        <div className="mb-14">
          <SectionHeading
            badge="Testimonies"
            title={
              <>
                God is Still{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Working Miracles
                </span>
              </>
            }
            subtitle="Real stories of healing, breakthrough, and divine intervention from our Triumphant Family."
            withDivider
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map((testimony) => (
            <div
              key={testimony.id}
              className="bg-white rounded-3xl p-7 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* Quote mark */}
              <div className="text-brand-gold-400 text-5xl font-heading leading-none mb-3 select-none">&ldquo;</div>

              {/* Text */}
              <p className="text-gray-700 leading-relaxed text-sm flex-1 mb-5">
                {truncate(testimony.testimony_text, 180)}
              </p>

              {/* Category */}
              {testimony.category && (
                <span className="inline-block px-3 py-1 rounded-full bg-brand-purple-50 text-brand-purple-700 text-xs font-semibold mb-5 w-fit">
                  {CATEGORY_LABELS[testimony.category] || "🙏 Testimony"}
                </span>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {testimony.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={testimony.photo_url}
                    alt={testimony.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple-500 to-brand-purple-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{getInitials(testimony.full_name)}</span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-brand-purple-900 text-sm">{testimony.full_name}</p>
                  {testimony.location && (
                    <p className="text-gray-400 text-xs">{testimony.location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Share testimony CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Has God done something amazing in your life?</p>
          <Link
            href="/testimonies"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-purple-600 text-white font-bold hover:bg-brand-purple-700 transition-all duration-300 shadow-brand hover:shadow-brand-lg"
          >
            Share Your Testimony
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}