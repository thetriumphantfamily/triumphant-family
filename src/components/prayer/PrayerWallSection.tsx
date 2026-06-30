// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER WALL — Approved prayer requests from the community
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient }            from "@/lib/supabase/server";
import SectionHeading              from "@/components/ui/SectionHeading";
import EmptyState                  from "@/components/ui/EmptyState";
import { formatDate, getInitials } from "@/lib/utils";

// ── Category labels with emoji ──
const CATEGORY_LABELS: Record<string, string> = {
  healing:      "🙌 Healing",
  breakthrough: "⚡ Breakthrough",
  salvation:    "✝️ Salvation",
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
    <section className="py-20 bg-gray-50" id="wall">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-14">
          <SectionHeading
            badge="Prayer Wall"
            title={
              <>
                Pray For{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Others
                </span>
              </>
            }
            subtitle="These are real prayer requests from our family members around the world. Please take a moment to lift one up in prayer."
            withDivider
          />
        </div>

        {/* No prayers yet */}
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
                className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Top row: category + answered badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-brand-purple-50 text-brand-purple-700 text-xs font-semibold">
                    {CATEGORY_LABELS[prayer.category] || "🙏 Prayer"}
                  </span>

                  {prayer.is_answered && (
                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Answered
                    </span>
                  )}
                </div>

                {/* Prayer text */}
                <p className="text-gray-700 leading-relaxed text-sm flex-1 mb-5">
                  {prayer.prayer_point}
                </p>

                {/* Footer: author + date */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple-500 to-brand-purple-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {prayer.is_anonymous ? "?" : getInitials(prayer.full_name)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-purple-900 text-sm truncate">
                      {prayer.is_anonymous ? "Anonymous" : prayer.full_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
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

                {/* Pray button (visual only — no functionality yet) */}
                <button
                  type="button"
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border-2 border-brand-purple-200 text-brand-purple-700 font-semibold text-sm hover:bg-brand-purple-50 hover:border-brand-purple-300 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  I&rsquo;m Praying
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}