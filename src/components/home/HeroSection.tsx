// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO SECTION — Photo only on left (socials moved to navbar)
// Prophet photo + 3 rotating gold pills + ministry branding
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useState, useEffect } from "react";
import Link  from "next/link";
import Image from "next/image";

// ── Rotating pill sets (each set has 3 words shown together) ──
const PILL_SETS = [
  ["Supernatural",  "Healings",     "Breakthrough"],
  ["Miracles",      "Deliverance",  "Victories"],
  ["Revival",       "Restoration",  "Glory"],
  ["Salvation",     "Prosperity",   "Favor"],
];

// ── Fixed star positions (pre-calculated, no Math.random() hydration issue) ──
const STARS = [
  { top: "12%", left: "8%",  delay: "0s",   duration: "3s" },
  { top: "25%", left: "85%", delay: "0.5s", duration: "4s" },
  { top: "45%", left: "15%", delay: "1s",   duration: "2.5s" },
  { top: "65%", left: "72%", delay: "1.5s", duration: "3.5s" },
  { top: "18%", left: "55%", delay: "0.8s", duration: "4.2s" },
  { top: "78%", left: "25%", delay: "2s",   duration: "2.8s" },
  { top: "35%", left: "90%", delay: "0.3s", duration: "3.8s" },
  { top: "88%", left: "60%", delay: "1.2s", duration: "3.2s" },
  { top: "5%",  left: "35%", delay: "2.5s", duration: "4.5s" },
  { top: "55%", left: "5%",  delay: "0.7s", duration: "2.7s" },
  { top: "70%", left: "45%", delay: "1.8s", duration: "3.3s" },
  { top: "22%", left: "70%", delay: "0.4s", duration: "4.1s" },
  { top: "92%", left: "82%", delay: "2.2s", duration: "2.9s" },
  { top: "48%", left: "38%", delay: "1.6s", duration: "3.6s" },
  { top: "82%", left: "12%", delay: "0.9s", duration: "4.3s" },
];

export default function HeroSection() {
  const [setIndex, setSetIndex] = useState(0);
  const [visible,  setVisible]  = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setSetIndex((prev) => (prev + 1) % PILL_SETS.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentPills = PILL_SETS[setIndex];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* DECORATIVE BACKGROUND (stage lights effect)                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Magenta blob top right */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-magenta-500/30 blur-3xl" />
        {/* Purple blob bottom left */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-purple-600/30 blur-3xl" />
        {/* Gold light center */}
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-brand-gold-400/10 blur-3xl animate-pulse-slow" />

        {/* Diagonal light beams */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <div className="absolute top-0 right-10 w-1 h-full bg-gradient-to-b from-brand-gold-400 to-transparent rotate-12" />
          <div className="absolute top-0 right-32 w-1 h-full bg-gradient-to-b from-brand-magenta-400 to-transparent rotate-12" />
          <div className="absolute top-0 right-56 w-1 h-full bg-gradient-to-b from-brand-purple-300 to-transparent rotate-12" />
        </div>

        {/* Star particles (fixed positions, no hydration mismatch) */}
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse-slow"
            style={{
              top:               star.top,
              left:              star.left,
              animationDelay:    star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MAIN CONTENT — Clean layout, no social pills                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative z-10 container-custom pt-3 pb-3 lg:pt-0 lg:pb-2">
        <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:gap-0 items-start max-w-7xl mx-auto">

          {/* ═════════════════════════════════════════════════════ */}
          {/* LEFT — Prophet Photo Only                              */}
          {/* ═════════════════════════════════════════════════════ */}
          <div className="relative flex flex-col items-center sm:items-end -ml-2 sm:ml-0 lg:-mr-12 xl:-mr-20">

            {/* Photo wrapper */}
            <div className="relative w-full flex items-end justify-center sm:justify-end">

              {/* Prophet photo — responsive sizing */}
              <Image
                src="/images/prophet/prophet.png"
                alt="Prophet Olayiwole Ogunsola"
                width={1000}
                height={1250}
                className="w-auto max-h-[320px] sm:max-h-[480px] md:max-h-[620px] lg:max-h-[800px] object-contain drop-shadow-2xl"
                priority
                unoptimized
                style={{ maxWidth: "100%" }}
              />

              {/* Gold script signature — ON HIS CLOTH (chest/midsection area) */}
              <div className="absolute bottom-[35%] left-0 right-0 text-center pointer-events-none z-20">
                <p className="font-script text-brand-gold-400 text-2xl sm:text-4xl lg:text-7xl leading-none drop-shadow-2xl" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.95)" }}>
                  Prophet
                </p>
                <p className="text-white font-bold text-[10px] sm:text-sm lg:text-xl tracking-wider uppercase mt-1 drop-shadow-lg" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}>
                  Olayiwole
                </p>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════ */}
          {/* RIGHT — Content (clean, no social pills)               */}
          {/* ═════════════════════════════════════════════════════ */}
          <div className="text-left flex flex-col justify-start pt-2 lg:pt-2 -mr-2 sm:mr-0 lg:-ml-4 xl:-ml-8 relative z-10">

            {/* "Experience" script word */}
            <div className="mb-2 sm:mb-4">
              <p className="font-script text-2xl sm:text-4xl md:text-5xl lg:text-7xl text-red-500 leading-none drop-shadow-lg" style={{ textShadow: "0 2px 15px rgba(239,68,68,0.6)" }}>
                Experience
              </p>
            </div>

            {/* 3 Animated Gold Pills */}
            <div
              className="flex flex-col gap-1.5 sm:gap-2 lg:gap-2.5 mb-3 sm:mb-5 transition-opacity duration-500"
              style={{ opacity: visible ? 1 : 0 }}
            >
              {currentPills.map((pill, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className="bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-heading font-bold text-xs sm:text-base md:text-lg lg:text-2xl py-1.5 sm:py-2 lg:py-3 px-3 sm:px-5 lg:px-6 rounded-full shadow-gold text-center animate-slide-up"
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-white/90 text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4">
              We gather for explosive prayer storms, glorious worship, and life-changing encounters with the Holy Spirit. Salvation, healing, and unstoppable victories await you here!
            </p>

            {/* Tagline */}
            <p className="font-script text-brand-gold-400 text-base sm:text-xl lg:text-2xl mb-3 sm:mb-5">
              Pray with us. Triumph with us.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-start">
              <Link
                href="/prayer"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-xs sm:text-sm lg:text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="truncate">Prayer Request</span>
              </Link>

              <Link
                href="/live"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full border-2 border-white/40 text-white font-bold text-xs sm:text-sm lg:text-base hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Live</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}