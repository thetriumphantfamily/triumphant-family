// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WELCOME SECTION — Compact + Justified on both layouts
// Mobile: Photo on top + justified paragraphs (quote removed)
// Desktop: Photo LEFT + justified paragraphs (compact spacing)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import Image from "next/image";

export default function WelcomeSection() {
  return (
    <section className="relative py-12 lg:pt-14 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-magenta-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-brand-gold-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 container-custom">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* MOBILE LAYOUT (default)                                    */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 gap-8 items-center">

            {/* Photo */}
            <div className="relative flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border-2 border-brand-gold-400/30 animate-pulse-slow" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full border border-brand-gold-300/40" />
              </div>

              <div className="relative w-[260px] h-[340px] md:w-[340px] md:h-[440px] rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-gold-400/60">
                <Image
                  src="/images/hero/prophet-1.png"
                  alt="Prophet Olayiwole Ogunsola"
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-brand-purple-900 via-brand-purple-900/70 to-transparent" />
                <div className="absolute bottom-4 inset-x-0 text-center px-4 z-10">
                  <p className="font-script text-brand-gold-400 text-2xl md:text-3xl leading-none drop-shadow-lg" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                    Prophet
                  </p>
                  <p className="text-white font-bold text-sm md:text-base tracking-wider uppercase drop-shadow-lg" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                    Olayiwole Ogunsola
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-gold-400/40 bg-brand-gold-400/10 mb-5">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-brand-gold-300 font-bold text-xs uppercase tracking-widest">
                  A Word from the Man of God
                </span>
              </div>

              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                  The Triumphant Family
                </span>
              </h2>

              {/* Justified paragraphs (quote removed) */}
              <div className="space-y-4 text-brand-purple-100 text-base md:text-lg leading-relaxed mb-6">
                <p className="text-justify">
                  God has called us together as a family — a family of prayer 
                  warriors, worshippers, and believers who refuse to accept anything 
                  less than God&rsquo;s best.
                </p>
                <p className="text-justify">
                  At The Triumphant Family, we believe in the supernatural power of
                  prayer, the life-changing Word of God, and the unstoppable move of
                  the Holy Spirit. Every service, every prayer session, every
                  encounter is designed to connect you with Heaven.
                </p>
                <p className="font-bold text-brand-gold-400 text-lg text-center">
                  You belong here. You are family.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-brand-purple-900 text-lg">OO</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-base">Prophet Olayiwole Ogunsola</p>
                  <p className="text-sm text-brand-gold-300">Founder &amp; General Overseer</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                >
                  Learn About Us
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/prayer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold hover:bg-white/20 hover:border-white transition-all duration-300"
                >
                  Send a Prayer Request
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* DESKTOP LAYOUT (lg+ only)                                   */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="hidden lg:block">

          {/* Top center: White glass badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
              <span className="text-white font-bold text-sm uppercase tracking-widest">
                A Word from the Man of God
              </span>
            </div>
          </div>

          {/* Center: Heading on ONE LINE */}
          <div className="text-center mb-10">
            <h2 className="font-heading text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight whitespace-nowrap">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                The Triumphant Family
              </span>
            </h2>
          </div>

          {/* Split: Photo LEFT + Content column CENTER */}
          <div className="grid grid-cols-12 gap-8 items-start">

            {/* Photo — extreme left (cols 1-4) */}
            <div className="col-span-4 relative flex justify-start">
              <div className="absolute inset-0 flex items-center justify-start pl-4 pointer-events-none">
                <div className="w-[420px] h-[420px] rounded-full border-2 border-brand-gold-400/30 animate-pulse-slow" />
              </div>
              <div className="absolute inset-0 flex items-center justify-start pl-4 pointer-events-none">
                <div className="w-[360px] h-[360px] rounded-full border border-brand-gold-300/40" />
              </div>

              <div className="relative w-[360px] h-[460px] rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-gold-400/60">
                <Image
                  src="/images/hero/prophet-1.png"
                  alt="Prophet Olayiwole Ogunsola"
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-brand-purple-900 via-brand-purple-900/70 to-transparent" />
                <div className="absolute bottom-4 inset-x-0 text-center px-4 z-10">
                  <p className="font-script text-brand-gold-400 text-3xl leading-none drop-shadow-lg" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                    Prophet
                  </p>
                  <p className="text-white font-bold text-base tracking-wider uppercase drop-shadow-lg" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                    Olayiwole Ogunsola
                  </p>
                </div>
              </div>
            </div>

            {/* Content Block (cols 5-12) */}
            <div className="col-span-8">
              
              {/* Justified Paragraphs */}
              <div className="space-y-6 mb-8">
                <p className="text-brand-purple-100 text-2xl xl:text-3xl leading-relaxed text-justify">
                  God has called us together as a family — a family of prayer 
                  warriors, worshippers, and believers who refuse to accept anything 
                  less than God&rsquo;s best.
                </p>
                <p className="text-brand-purple-100 text-2xl xl:text-3xl leading-relaxed text-justify">
                  At The Triumphant Family, we believe in the supernatural power of
                  prayer, the life-changing Word of God, and the unstoppable move of
                  the Holy Spirit. Every service, every prayer session, every
                  encounter is designed to connect you with Heaven.
                </p>
                <p className="font-bold text-brand-gold-400 text-3xl xl:text-4xl text-center">
                  You belong here. You are family.
                </p>
              </div>

              {/* Signature */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-brand-purple-900 text-xl">OO</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-lg">Prophet Olayiwole Ogunsola</p>
                  <p className="text-base text-brand-gold-300">Founder &amp; General Overseer</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-row gap-4 justify-start">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                >
                  Learn About Us
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/prayer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold text-lg hover:bg-white/20 hover:border-white transition-all duration-300"
                >
                  Send a Prayer Request
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}