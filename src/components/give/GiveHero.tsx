// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GIVE HERO — Page banner with heart icon + scripture
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";

export default function GiveHero() {
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
        {/* Heart icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-6">
          <svg
            className="w-10 h-10 text-brand-purple-900"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-gold-400/40 bg-brand-gold-400/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
          <span className="text-brand-gold-300 font-semibold text-sm uppercase tracking-widest">
            Partner With Us
          </span>
        </div>

        {/* Main heading */}
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
          Give{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
            Generously
          </span>
        </h1>

        {/* Description */}
        <p className="text-brand-purple-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
          Every seed sown into this ministry advances the Kingdom of God,
          transforms lives, and releases the anointing to more nations. Give
          cheerfully and expect a divine harvest.
        </p>

        {/* Scripture */}
        <p className="font-script text-brand-gold-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-4">
          &ldquo;Every man according as he purposeth in his heart, so let him
          give; not grudgingly, or of necessity: for God loveth a cheerful
          giver.&rdquo;
        </p>
        <p className="text-brand-purple-200 text-sm font-semibold mb-8">
          &mdash; 2 Corinthians 9:7
        </p>

        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-sm text-brand-purple-200">
          <Link href="/" className="hover:text-brand-gold-400 transition-colors">
            Home
          </Link>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-brand-gold-400 font-semibold">Give</span>
        </nav>
      </div>
    </section>
  );
}