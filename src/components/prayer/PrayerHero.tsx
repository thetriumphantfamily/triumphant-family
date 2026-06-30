// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER HERO — Page banner with breadcrumb + scripture
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";

export default function PrayerHero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 py-16 lg:py-24">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-magenta-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-brand-gold-400/10 blur-3xl" />

        {/* Diagonal light beams */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-15">
          <div className="absolute top-0 right-10 w-1 h-full bg-gradient-to-b from-brand-gold-400 to-transparent rotate-12" />
          <div className="absolute top-0 right-40 w-1 h-full bg-gradient-to-b from-brand-magenta-400 to-transparent rotate-12" />
        </div>
      </div>

      <div className="relative z-10 container-custom text-center">

        {/* Praying hands icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-6">
          <svg className="w-10 h-10 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-gold-400/40 bg-brand-gold-400/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
          <span className="text-brand-gold-300 font-semibold text-sm uppercase tracking-widest">
            We Pray With You
          </span>
        </div>

        {/* Main heading */}
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
          Submit a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
            Prayer Request
          </span>
        </h1>

        {/* Description */}
        <p className="text-brand-purple-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
          You are not alone. Share what is on your heart, and let The Triumphant
          Family stand in agreement with you. We believe in the power of united prayer.
        </p>

        {/* Scripture */}
        <p className="font-script text-brand-gold-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
          &ldquo;Again I say to you, if two of you agree on earth about anything they ask,
          it will be done for them by my Father in heaven.&rdquo;
        </p>
        <p className="text-brand-purple-200 text-sm font-semibold mb-8">
          — Matthew 18:19
        </p>

        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-sm text-brand-purple-200">
          <Link href="/" className="hover:text-brand-gold-400 transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-brand-gold-400 font-semibold">Prayer</span>
        </nav>
      </div>
    </section>
  );
}