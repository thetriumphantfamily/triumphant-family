// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO SECTION — Mobile: 1 photo | Desktop: 3 photos side-by-side
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useState, useEffect } from "react";
import Link  from "next/link";
import Image from "next/image";

const PILL_SETS = [
  ["Supernatural",  "Healings",     "Breakthrough"],
  ["Miracles",      "Deliverance",  "Victories"],
  ["Revival",       "Restoration",  "Glory"],
  ["Salvation",     "Prosperity",   "Favor"],
];

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

const STARS = [
  { top: "12%", left: "8%",  delay: "0s",   duration: "3s" },
  { top: "25%", left: "85%", delay: "0.5s", duration: "4s" },
  { top: "45%", left: "15%", delay: "1s",   duration: "2.5s" },
  { top: "65%", left: "72%", delay: "1.5s", duration: "3.5s" },
  { top: "18%", left: "55%", delay: "0.8s", duration: "4.2s" },
  { top: "78%", left: "25%", delay: "2s",   duration: "2.8s" },
  { top: "35%", left: "90%", delay: "0.3s", duration: "3.8s" },
  { top: "88%", left: "60%", delay: "1.2s", duration: "3.2s" },
];

export default function HeroSection() {
  const [pillIndex,    setPillIndex]    = useState(0);
  const [pillVisible,  setPillVisible]  = useState(true);
  const [photoIndex1,  setPhotoIndex1]  = useState(0);
  const [photoIndex2,  setPhotoIndex2]  = useState(3);
  const [photoIndex3,  setPhotoIndex3]  = useState(6);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex1((prev) => (prev + 1) % HERO_PHOTOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const timeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setPhotoIndex2((prev) => (prev + 1) % HERO_PHOTOS.length);
      }, 5000);
    }, 1500);
    return () => {
      clearTimeout(timeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const timeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setPhotoIndex3((prev) => (prev + 1) % HERO_PHOTOS.length);
      }, 5000);
    }, 3000);
    return () => {
      clearTimeout(timeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const currentPills = PILL_SETS[pillIndex];
  const currentPhoto1 = HERO_PHOTOS[photoIndex1];

  return (
    <section className="relative w-full h-[380px] sm:h-[420px] md:h-[480px] lg:h-[550px] overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">

      {/* MOBILE: SINGLE PHOTO */}
      <div className="absolute inset-0 z-0 md:hidden">
        {HERO_PHOTOS.map((photo, i) => (
          <div
            key={`mobile-${photo.src}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === photoIndex1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={photo.src}
              alt="The Triumphant Family Ministry"
              fill
              className="object-cover object-center"
              priority={i === 0}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* DESKTOP: 3 PHOTOS SIDE-BY-SIDE */}
      <div className="absolute inset-0 z-0 hidden md:grid md:grid-cols-3">

        <div className="relative overflow-hidden">
          {HERO_PHOTOS.map((photo, i) => (
            <div
              key={`desktop1-${photo.src}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === photoIndex1 ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={photo.src}
                alt="The Triumphant Family Ministry"
                fill
                className="object-cover object-center"
                priority={i === 0}
                unoptimized
              />
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden">
          {HERO_PHOTOS.map((photo, i) => (
            <div
              key={`desktop2-${photo.src}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === photoIndex2 ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={photo.src}
                alt="The Triumphant Family Ministry"
                fill
                className="object-cover object-center"
                unoptimized
              />
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden">
          {HERO_PHOTOS.map((photo, i) => (
            <div
              key={`desktop3-${photo.src}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === photoIndex3 ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={photo.src}
                alt="The Triumphant Family Ministry"
                fill
                className="object-cover object-center"
                unoptimized
              />
            </div>
          ))}
        </div>

      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-black/40" />

      {/* Column dividers (desktop) */}
      <div className="absolute inset-0 z-[6] pointer-events-none hidden md:block">
        <div className="grid grid-cols-3 h-full">
          <div className="border-r border-brand-purple-900/50" />
          <div className="border-r border-brand-purple-900/50" />
          <div />
        </div>
      </div>

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none z-10">
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

      {/* Prophet signature */}
      <div
        className={`absolute top-3 right-3 sm:top-4 sm:right-4 text-right pointer-events-none z-20 transition-opacity duration-1000 ${
          currentPhoto1.isProphet ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-script text-brand-gold-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none drop-shadow-2xl" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.95)" }}>
          Prophet
        </p>
        <p className="text-white font-bold text-[9px] sm:text-[10px] md:text-xs lg:text-sm tracking-wider uppercase mt-0.5 drop-shadow-lg" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}>
          Olayiwole
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-20 container-custom py-6 sm:py-7 md:py-8 lg:py-10 flex items-center h-full">
        <div className="max-w-xl w-full">

          <div className="mb-2 sm:mb-3">
            <p className="font-script text-red-500 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none drop-shadow-lg" style={{ textShadow: "0 2px 15px rgba(239,68,68,0.6)" }}>
              Experience
            </p>
          </div>

          <div
            className="flex flex-col gap-1.5 sm:gap-2 mb-3 sm:mb-4 max-w-xs transition-opacity duration-500"
            style={{ opacity: pillVisible ? 1 : 0 }}
          >
            {currentPills.map((pill, i) => (
              <div
                key={`${pillIndex}-${i}`}
                className="bg-brand-gold-400/25 border-2 border-brand-gold-400/50 text-white font-heading font-bold text-[10px] sm:text-xs md:text-sm lg:text-base py-1 sm:py-1.5 lg:py-2 px-2.5 sm:px-3 lg:px-5 rounded-full shadow-lg text-center animate-slide-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                }}
              >
                {pill}
              </div>
            ))}
          </div>

          <p className="text-white text-[10px] sm:text-xs md:text-sm leading-snug mb-2 sm:mb-3 drop-shadow-lg font-medium max-w-md" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>
            We gather for explosive prayer storms, glorious worship, and life-changing encounters with the Holy Spirit.
          </p>

          <p className="font-script text-brand-gold-400 text-base sm:text-lg md:text-xl lg:text-2xl mb-3 sm:mb-4 drop-shadow-lg" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
            Pray with us. Triumph with us.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/prayer"
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-[11px] sm:text-xs lg:text-sm shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Prayer Request
            </Link>

            <Link
              href="/live"
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 text-white font-bold text-[11px] sm:text-xs lg:text-sm hover:border-brand-gold-400 transition-all duration-300"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Live
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}