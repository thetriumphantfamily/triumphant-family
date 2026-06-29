// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER CTA SECTION — Bold prayer request banner
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";

const PRAYER_CATEGORIES = [
  "Healing",
  "Breakthrough",
  "Finances",
  "Marriage",
  "Salvation",
  "Deliverance",
  "Family",
  "Career",
  "Thanksgiving",
];

export default function PrayerCTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple-700 via-brand-purple-800 to-brand-violet-900 p-10 md:p-16 text-center text-white">

          {/* ── Background blobs ── */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-brand-gold-400/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-brand-magenta-500/15 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-gold-400/40 bg-brand-gold-400/10 mb-7">
              <svg className="w-4 h-4 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span className="text-brand-gold-300 font-bold text-sm uppercase tracking-widest">
                We Pray Together
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Whatever You&rsquo;re Facing,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 to-brand-gold-500">
                God Has an Answer
              </span>
            </h2>

            <p className="text-brand-purple-200 text-base md:text-lg leading-relaxed mb-8">
              You don&rsquo;t have to face your battles alone. Submit your prayer request and let the
              entire Triumphant Family stand in agreement with you. We believe in the
              miracle-working power of united prayer.
            </p>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {PRAYER_CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/prayer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                Submit Prayer Request
              </Link>
              <Link
                href="/prayer#wall"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                View Prayer Wall
              </Link>
            </div>

            {/* Scripture */}
            <p className="mt-10 text-brand-purple-300 text-sm italic">
              &ldquo;Again I say to you, if two of you agree on earth about anything they ask,
              it will be done for them by my Father in heaven.&rdquo; — Matthew 18:19
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}