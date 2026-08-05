// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO SECTION CLIENT — Metallic text + minimal gold + no prophet signature
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HeroSectionClientProps {
  photos: string[];
}

const PILL_SETS = [
  ["Supernatural", "Healings", "Breakthrough"],
  ["Miracles", "Deliverance", "Victories"],
  ["Revival", "Restoration", "Glory"],
  ["Salvation", "Prosperity", "Favor"],
];

const STARS = [
  { top: "12%", left: "8%", delay: "0s", duration: "3s" },
  { top: "25%", left: "85%", delay: "0.5s", duration: "4s" },
  { top: "45%", left: "15%", delay: "1s", duration: "2.5s" },
  { top: "65%", left: "72%", delay: "1.5s", duration: "3.5s" },
  { top: "18%", left: "55%", delay: "0.8s", duration: "4.2s" },
  { top: "78%", left: "25%", delay: "2s", duration: "2.8s" },
  { top: "35%", left: "90%", delay: "0.3s", duration: "3.8s" },
  { top: "88%", left: "60%", delay: "1.2s", duration: "3.2s" },
];

export default function HeroSectionClient({ photos }: HeroSectionClientProps) {
  const totalPhotos = photos.length;

  const [pillIndex, setPillIndex] = useState(0);
  const [pillVisible, setPillVisible] = useState(true);
  const [photoIndex1, setPhotoIndex1] = useState(0);
  const [photoIndex2, setPhotoIndex2] = useState(totalPhotos > 3 ? 3 : 0);
  const [photoIndex3, setPhotoIndex3] = useState(totalPhotos > 6 ? 6 : 0);

  // Rotate pills
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

  // Photo 1 rotation
  useEffect(() => {
    if (totalPhotos <= 1) return;
    const interval = setInterval(() => {
      setPhotoIndex1((prev) => (prev + 1) % totalPhotos);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPhotos]);

  // Photo 2 rotation (staggered)
  useEffect(() => {
    if (totalPhotos <= 1) return;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const timeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setPhotoIndex2((prev) => (prev + 1) % totalPhotos);
      }, 5000);
    }, 1500);
    return () => {
      clearTimeout(timeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [totalPhotos]);

  // Photo 3 rotation (staggered)
  useEffect(() => {
    if (totalPhotos <= 1) return;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const timeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setPhotoIndex3((prev) => (prev + 1) % totalPhotos);
      }, 5000);
    }, 3000);
    return () => {
      clearTimeout(timeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [totalPhotos]);

  const currentPills = PILL_SETS[pillIndex];

  return (
    <section className="relative w-full h-[380px] sm:h-[420px] md:h-[480px] lg:h-[550px] overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">

      {/* MOBILE: SINGLE PHOTO */}
      <div className="absolute inset-0 z-0 md:hidden">
        {photos.map((photo, i) => (
          <div
            key={`mobile-${photo}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === photoIndex1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={photo}
              alt="The Triumphant Family Ministry"
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* DESKTOP: 3 PHOTOS SIDE-BY-SIDE */}
      <div className="absolute inset-0 z-0 hidden md:grid md:grid-cols-3">
        <div className="relative overflow-hidden">
          {photos.map((photo, i) => (
            <div
              key={`desktop1-${photo}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === photoIndex1 ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={photo}
                alt="The Triumphant Family Ministry"
                loading={i === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden">
          {photos.map((photo, i) => (
            <div
              key={`desktop2-${photo}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === photoIndex2 ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={photo}
                alt="The Triumphant Family Ministry"
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden">
          {photos.map((photo, i) => (
            <div
              key={`desktop3-${photo}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === photoIndex3 ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={photo}
                alt="The Triumphant Family Ministry"
                loading="lazy"
                className="w-full h-full object-cover object-center"
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
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-20 md:grid md:grid-cols-3 h-full">
        {/* First column — text lives here on desktop */}
        <div className="container-custom md:container-none md:pl-6 lg:pl-10 py-6 sm:py-7 md:py-8 lg:py-10 flex items-center h-full md:pr-4">
          <div className="w-full md:max-w-full">

            {/* 1. "Experience" — METALLIC WHITE 3D */}
            <div className="mb-2 sm:mb-3">
              <p
                className="font-script text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-none"
                style={{
                  color: "#ffffff",
                  background: "linear-gradient(180deg, #ffffff 0%, #f0f0f0 50%, #cccccc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 1px 0 #ffffff, 0 2px 0 #e0e0e0, 0 3px 0 #cccccc, 0 4px 0 #b0b0b0, 0 5px 8px rgba(0,0,0,0.4), 0 8px 20px rgba(255,255,255,0.15)",
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))",
                }}
              >
                Experience
              </p>
            </div>

            {/* 2. Rotating pills — METALLIC NO BG */}
            <div
              className="flex flex-col gap-2 sm:gap-2.5 mb-3 sm:mb-4 max-w-xs transition-opacity duration-500"
              style={{ opacity: pillVisible ? 1 : 0 }}
            >
              {currentPills.map((pill, i) => (
                <div
                  key={`${pillIndex}-${i}`}
                  className="font-heading font-black text-sm sm:text-base md:text-lg lg:text-xl text-center animate-slide-up"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    background: "linear-gradient(180deg, #ffffff 0%, #f0f0f0 50%, #cccccc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "0 1px 0 #ffffff, 0 2px 0 #e0e0e0, 0 3px 0 #cccccc, 0 4px 6px rgba(0,0,0,0.6), 0 6px 15px rgba(255,255,255,0.1)",
                    filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.7))",
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>

            {/* 3. Main paragraph — WHITE (unchanged) */}
            <p
              className="text-white text-[10px] sm:text-xs md:text-[11px] lg:text-sm leading-snug mb-2 sm:mb-3 drop-shadow-lg font-medium max-w-md md:max-w-none"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}
            >
              We gather for explosive prayer storms, glorious worship, and life-changing encounters with the Holy Spirit.
            </p>

            {/* 4. Tagline — GOLD, readable heading font */}
<p
  className="font-heading italic text-brand-gold-400 text-base sm:text-lg md:text-lg lg:text-xl mb-3 sm:mb-4 drop-shadow-lg font-bold"
  style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
>
  Pray With Us. Triumph With Us.
</p>

            {/* 5 + 6. Buttons — BOTH match (purple + gold border) */}
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">

              {/* Prayer Request — now purple + gold border */}
              <Link
                href="/prayer"
                className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 text-white font-bold text-[11px] sm:text-xs lg:text-sm hover:border-brand-gold-400 transition-all duration-300"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Prayer Request
              </Link>

              {/* Watch Live — kept as is */}
              <Link
                href="/live"
                className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 text-white font-bold text-[11px] sm:text-xs lg:text-sm hover:border-brand-gold-400 transition-all duration-300"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Live
              </Link>
            </div>
          </div>
        </div>

        {/* Empty second column on desktop */}
        <div className="hidden md:block" />

        {/* Empty third column on desktop */}
        <div className="hidden md:block" />
      </div>
    </section>
  );
}