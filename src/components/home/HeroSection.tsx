// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO SECTION — Both sides faded + atmospheric
// LEFT:  Photo carousel WITH purple overlay (50% photo, signature on top)
// RIGHT: Faded background rotation (same treatment)
// PILLS: Rotating words (3.5s)
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

// ── Main carousel photos (LEFT side — 5s rotation) ──
const HERO_PHOTOS = [
  { src: "/images/hero/prophet-1.png",  isProphet: true },
  { src: "/images/hero/ministry-1.png", isProphet: false },
  { src: "/images/hero/prophet-2.png",  isProphet: true },
  { src: "/images/hero/ministry-2.png", isProphet: false },
  { src: "/images/hero/prophet-3.png",  isProphet: true },
  { src: "/images/hero/ministry-3.png", isProphet: false },
  { src: "/images/hero/prophet-4.png",  isProphet: true },
  { src: "/images/hero/ministry-4.png", isProphet: false },
  { src: "/images/hero/ministry-5.png", isProphet: false },
  { src: "/images/hero/ministry-6.png", isProphet: false },
];

// ── Background fade photos (RIGHT side — ministry only, 8s rotation) ──
const BG_PHOTOS = [
  "/images/hero/ministry-1.png",
  "/images/hero/ministry-2.png",
  "/images/hero/ministry-3.png",
  "/images/hero/ministry-4.png",
  "/images/hero/ministry-5.png",
  "/images/hero/ministry-6.png",
];

// ── Fixed star positions (no Math.random() hydration issue) ──
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
  const [pillIndex,    setPillIndex]    = useState(0);
  const [pillVisible,  setPillVisible]  = useState(true);
  const [photoIndex,   setPhotoIndex]   = useState(0);
  const [bgIndex,      setBgIndex]      = useState(0);

  // ─── Pills rotate every 3.5s ───
  useEffect(() => {
    const interval = setInterval(() => {
      setPillVisible(false);
      setTimeout(() => {
        setPillIndex((prev) => (prev + 1) % PILL_SETS.length);
        setPillVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // ─── Main photo rotates every 5s ───
  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % HERO_PHOTOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ─── Background photo rotates every 8s ───
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_PHOTOS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentPills  = PILL_SETS[pillIndex];
  const currentPhoto  = HERO_PHOTOS[photoIndex];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* DECORATIVE BACKGROUND (stage lights effect)                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-magenta-500/30 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-purple-600/30 blur-3xl" />
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-brand-gold-400/10 blur-3xl animate-pulse-slow" />

        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <div className="absolute top-0 right-10 w-1 h-full bg-gradient-to-b from-brand-gold-400 to-transparent rotate-12" />
          <div className="absolute top-0 right-32 w-1 h-full bg-gradient-to-b from-brand-magenta-400 to-transparent rotate-12" />
          <div className="absolute top-0 right-56 w-1 h-full bg-gradient-to-b from-brand-purple-300 to-transparent rotate-12" />
        </div>

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
      {/* MAIN CONTENT — 2 columns (both faded + atmospheric)         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative z-10 container-custom pt-2 pb-3 lg:pt-0 lg:pb-2">
        <div className="grid grid-cols-2 gap-1 sm:gap-2 lg:gap-0 items-start max-w-7xl mx-auto">

          {/* ═════════════════════════════════════════════════════ */}
          {/* LEFT — Photo Carousel FADED (same as right side)       */}
          {/* ═════════════════════════════════════════════════════ */}
          <div className="relative flex items-start justify-center sm:justify-end -ml-2 sm:ml-0 lg:-mr-12 xl:-mr-20">

            {/* Container with FIXED HEIGHT */}
            <div className="relative w-full h-[280px] sm:h-[450px] md:h-[600px] lg:h-[780px] overflow-hidden rounded-3xl">

              {/* All photos stacked with FADE TREATMENT */}
              {HERO_PHOTOS.map((photo, i) => (
                <div
                  key={photo.src}
                  className={`absolute top-0 left-0 right-0 bottom-0 transition-opacity duration-1000 ease-in-out ${
                    i === photoIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  {/* Photo with 50% opacity (like right side) */}
                  <Image
                    src={photo.src}
                    alt="The Triumphant Family Ministry"
                    width={1000}
                    height={1250}
                    className={`w-full h-full object-cover object-top sm:object-center opacity-50 ${
                      i === photoIndex ? "animate-ken-burns" : ""
                    }`}
                    priority={i === 0}
                    unoptimized
                  />
                  {/* Purple gradient overlay (same as right side) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-900/70 via-brand-purple-800/60 to-brand-violet-900/70" />
                </div>
              ))}

              {/* Gold script signature — only on prophet photos (POPS on top) */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-20 transition-opacity duration-1000 ${
                  currentPhoto.isProphet ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="font-script text-brand-gold-400 text-3xl sm:text-5xl md:text-6xl lg:text-8xl leading-none drop-shadow-2xl" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.95)" }}>
                  Prophet
                </p>
                <p className="text-white font-bold text-xs sm:text-base md:text-lg lg:text-2xl tracking-wider uppercase mt-2 drop-shadow-lg" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}>
                  Olayiwole
                </p>
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════ */}
          {/* RIGHT — Content + Background (unchanged)               */}
          {/* ═════════════════════════════════════════════════════ */}
          <div className="relative text-left flex flex-col justify-start pt-2 lg:pt-2 -mr-2 sm:mr-0 lg:-ml-4 xl:-ml-8">

            {/* ─── Faded background photos ─── */}
            <div className="absolute inset-0 -m-2 sm:-m-4 lg:-m-6 overflow-hidden rounded-3xl pointer-events-none z-0">
              {BG_PHOTOS.map((src, i) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                    i === bgIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-900/70 via-brand-purple-800/60 to-brand-violet-900/70" />
                </div>
              ))}
            </div>

            {/* ─── Content (z-10, above background) ─── */}
            <div className="relative z-10">

              {/* "Experience" script word */}
              <div className="mb-2 sm:mb-4">
                <p className="font-script text-2xl sm:text-4xl md:text-5xl lg:text-7xl text-red-500 leading-none drop-shadow-lg" style={{ textShadow: "0 2px 15px rgba(239,68,68,0.6)" }}>
                  Experience
                </p>
              </div>

              {/* 3 Animated Gold Pills */}
              <div
                className="flex flex-col gap-1.5 sm:gap-2 lg:gap-2.5 mb-3 sm:mb-5 transition-opacity duration-500"
                style={{ opacity: pillVisible ? 1 : 0 }}
              >
                {currentPills.map((pill, i) => (
                  <div
                    key={`${pillIndex}-${i}`}
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
              <p className="text-white text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4 drop-shadow-lg font-medium">
                We gather for explosive prayer storms, glorious worship, and life-changing encounters with the Holy Spirit. Salvation, healing, and unstoppable victories await you here!
              </p>

              {/* Tagline */}
              <p className="font-script text-brand-gold-400 text-base sm:text-xl lg:text-2xl mb-3 sm:mb-5 drop-shadow-lg">
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
      </div>
    </section>
  );
}