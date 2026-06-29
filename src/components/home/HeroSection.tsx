// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO SECTION — Tight top + bottom, content drives the height
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
      {/* MAIN CONTENT — NO bottom gap, photo + content drive height   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative z-10 container-custom pt-0 pb-2 lg:pt-0 lg:pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start max-w-7xl mx-auto">

          {/* ═════════════════════════════════════════════════════ */}
          {/* LEFT — Prophet Photo (no forced min-height)            */}
          {/* ═════════════════════════════════════════════════════ */}
          <div className="relative flex flex-col items-center lg:items-end order-2 lg:order-1 lg:-mr-12 xl:-mr-20">

            {/* Photo wrapper */}
            <div className="relative w-full flex items-end justify-center lg:justify-end">

              {/* Prophet photo */}
              <Image
                src="/images/prophet/prophet.png"
                alt="Prophet Olayiwole Ogunsola"
                width={1000}
                height={1250}
                className="w-auto max-h-[750px] object-contain drop-shadow-2xl"
                priority
                unoptimized
                style={{ maxWidth: "100%" }}
              />

              {/* Gold script signature — ON HIS CLOTH (chest/midsection area) */}
              <div className="absolute bottom-[35%] left-0 right-0 text-center pointer-events-none z-20">
                <p className="font-script text-brand-gold-400 text-5xl sm:text-6xl lg:text-7xl leading-none drop-shadow-2xl" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.95)" }}>
                  Prophet
                </p>
                <p className="text-white font-bold text-base sm:text-lg lg:text-xl tracking-wider uppercase mt-1 drop-shadow-lg" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}>
                  Olayiwole
                </p>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════ */}
          {/* RIGHT — Content (starts at TOP)                        */}
          {/* ═════════════════════════════════════════════════════ */}
          <div className="text-center lg:text-left order-1 lg:order-2 flex flex-col justify-start pt-4 lg:pt-2 lg:-ml-4 xl:-ml-8 relative z-10">

            {/* "Experience" script word */}
            <div className="mb-4">
              <p className="font-script text-5xl sm:text-6xl lg:text-7xl text-red-500 leading-none drop-shadow-lg" style={{ textShadow: "0 2px 15px rgba(239,68,68,0.6)" }}>
                Experience
              </p>
            </div>

            {/* 3 Animated Gold Pills */}
            <div
              className="flex flex-col gap-2.5 mb-6 transition-opacity duration-500"
              style={{ opacity: visible ? 1 : 0 }}
            >
              {currentPills.map((pill, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className="bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-heading font-bold text-lg sm:text-xl lg:text-2xl py-2.5 sm:py-3 px-6 rounded-full shadow-gold text-center animate-slide-up"
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-5">
              We gather for explosive prayer storms, glorious worship, prophetic declarations and life-changing encounters with the Holy Spirit. Salvation, healing, deliverance, and unstoppable victories await you here!
            </p>

            {/* Tagline */}
            <p className="font-script text-brand-gold-400 text-2xl mb-6">
              Pray with us. Triumph with us.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
              <Link
                href="/prayer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Submit Prayer Request
              </Link>

              <Link
                href="/live"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/40 text-white font-bold hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Live
              </Link>
            </div>

            {/* Social Handles (4 pills like flyer) */}
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto lg:mx-0">
              {/* Facebook */}
              <a
                href="https://m.facebook.com/wole.ola.376/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand-magenta-500/30 hover:bg-brand-magenta-500/50 backdrop-blur-sm border border-brand-magenta-400/40 rounded-full px-3 py-1.5 transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z"/>
                  </svg>
                </div>
                <span className="text-white text-xs font-semibold truncate">Prophet Olayiwole Triumphant</span>
              </a>

              {/* TikTok */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand-magenta-500/30 hover:bg-brand-magenta-500/50 backdrop-blur-sm border border-brand-magenta-400/40 rounded-full px-3 py-1.5 transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.1z"/>
                  </svg>
                </div>
                <span className="text-white text-xs font-semibold truncate">Prophet Olayiwole Triumphant</span>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/PastorOlayiwoleTriumphant"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand-magenta-500/30 hover:bg-brand-magenta-500/50 backdrop-blur-sm border border-brand-magenta-400/40 rounded-full px-3 py-1.5 transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="text-white text-xs font-semibold truncate">Prophet Olayiwole Triumphant</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/pastorolayiwoletriumphant"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-brand-magenta-500/30 hover:bg-brand-magenta-500/50 backdrop-blur-sm border border-brand-magenta-400/40 rounded-full px-3 py-1.5 transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="text-white text-xs font-semibold truncate">Prophet Olayiwole Triumphant</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}