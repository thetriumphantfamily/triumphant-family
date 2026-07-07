// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER WALL — Approved prayer requests (clean, no blobs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient }            from "@/lib/supabase/server";
import EmptyState                  from "@/components/ui/EmptyState";
import { formatDate, getInitials } from "@/lib/utils";
import Link                        from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  healing:      "🙌 Healing",
  breakthrough: "⚡ Breakthrough",
  salvation:    "✝ Salvation",
  marriage:     "💍 Marriage",
  family:       "👨‍👩‍👧 Family",
  finance:      "💰 Finance",
  career:       "📈 Career",
  deliverance:  "🔓 Deliverance",
  thanksgiving: "🙏 Thanksgiving",
  other:        "✨ Prayer",
};

export default async function PrayerWallSection() {
  const supabase = await createClient();

  const { data: prayers } = await supabase
    .from("prayer_requests")
    .select("id, full_name, prayer_point, category, country, is_anonymous, is_answered, created_at")
    .eq("is_approved", true)
    .eq("show_on_wall", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <section
      id="wall"
      className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden"
    >
      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Prayer Wall
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Pray For{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Others
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            These are real prayer requests from our family members around the world.
            Please take a moment to lift one up in prayer.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Empty state */}
        {(!prayers || prayers.length === 0) && (
          <EmptyState
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            title="Prayer Wall Coming Soon"
            description="Submitted prayers awaiting admin approval will appear here. Be the first to submit a prayer request above!"
            actionLabel="Submit a Prayer"
            actionHref="#form"
          />
        )}

        {/* Prayer cards */}
        {prayers && prayers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="group bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/20 hover:border-brand-gold-400/60 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
              >
                {/* Gold top bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Category + answered badge */}
                <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                  <span className="px-3 py-1 rounded-full bg-brand-gold-400/15 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold">
                    {CATEGORY_LABELS[prayer.category] || "🙏 Prayer"}
                  </span>

                  {prayer.is_answered && (
                    <span className="px-2.5 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Answered!
                    </span>
                  )}
                </div>

                {/* Prayer text */}
                <p className="text-brand-purple-100 leading-relaxed text-sm flex-1 mb-5 text-justify">
                  {prayer.prayer_point}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-purple-900 text-sm font-bold">
                      {prayer.is_anonymous ? "?" : getInitials(prayer.full_name)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">
                      {prayer.is_anonymous ? "Anonymous" : prayer.full_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-brand-purple-300">
                      {prayer.country && (
                        <>
                          <span className="truncate">{prayer.country}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{formatDate(prayer.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Pray button */}
                <Link
                  href="/prayer#form"
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border-2 border-white/30 text-white font-semibold text-sm hover:bg-brand-gold-400 hover:border-brand-gold-400 hover:text-brand-purple-900 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  I&rsquo;m Praying
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}