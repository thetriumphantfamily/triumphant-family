// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER CTA SECTION — Full-width themed prayer request banner
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
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold-400/15 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-magenta-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 container-custom text-center">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              We Pray Together
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="max-w-4xl mx-auto mb-8 lg:mb-10">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Whatever You&rsquo;re Facing,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              God Has an Answer
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            You don&rsquo;t have to face your battles alone. Submit your prayer request and let the
            entire Triumphant Family stand in agreement with you. We believe in the
            miracle-working power of united prayer.
          </p>

          {/* Gold divider */}
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 lg:mb-10 max-w-3xl mx-auto">
          {PRAYER_CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1.5 rounded-full bg-brand-gold-400/15 border border-brand-gold-400/40 text-brand-gold-300 text-xs lg:text-sm font-bold"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center mb-8">
          <Link
            href="/prayer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 lg:py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base lg:text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
            </svg>
            Submit Prayer Request
          </Link>
          <Link
            href="/prayer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 lg:py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold text-base lg:text-lg hover:bg-white/20 hover:border-white transition-all duration-300"
          >
            View Prayer Wall
          </Link>
        </div>

        {/* Scripture — CLEAN READABLE FONT (not script) */}
        <div className="max-w-2xl mx-auto">
          <p className="text-brand-gold-400 text-base md:text-lg lg:text-xl leading-relaxed italic mb-2" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            &ldquo;Again I say to you, if two of you agree on earth about anything they ask,
            it will be done for them by my Father in heaven.&rdquo;
          </p>
          <p className="text-brand-purple-200 text-sm font-semibold">
            — Matthew 18:19
          </p>
        </div>

      </div>
    </section>
  );
}