// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA HERO CLIENT — Rotating photos + registration CTA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TDAHeroClientProps {
  photos: string[];
}

export default function TDAHeroClient({ photos }: TDAHeroClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalPhotos = photos.length;

  useEffect(() => {
    if (totalPhotos <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalPhotos);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPhotos]);

  const getPhotoIndex = (offset: number) =>
    (activeIndex + offset) % totalPhotos;

  const renderPhotoLayer = (currentIndex: number) => (
    <>
      {photos.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt="Triumphant Disciples Academy"
            loading={i === 0 ? "eager" : "lazy"}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}
    </>
  );

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center">

      {/* MOBILE: single rotating photo */}
      <div className="absolute inset-0 z-0 md:hidden">
        {renderPhotoLayer(activeIndex)}
        <div className="absolute inset-0 z-10 bg-black/60" />
      </div>

      {/* DESKTOP: 3 photos side-by-side */}
      <div className="absolute inset-0 z-0 hidden md:grid md:grid-cols-3">
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(0))}</div>
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(1))}</div>
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(2))}</div>
        <div className="absolute inset-0 z-10 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom text-center py-14 lg:py-24 w-full">

        {/* Gold graduation cap icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-5 lg:mb-8">
          <svg
            className="w-8 h-8 lg:w-12 lg:h-12 text-brand-purple-900"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
          </svg>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-5 py-2 lg:px-6 lg:py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              TFAM Bible School
            </span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="font-heading text-3xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4">
          Triumphant{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
            Disciples
          </span>
          <br />
          Academy
        </h1>

        {/* Tagline */}
        <p className="font-script text-brand-gold-400 text-2xl md:text-3xl lg:text-4xl mb-5 lg:mb-6">
          Rightly Dividing the Word of Truth
        </p>

        {/* Scripture */}
        <p className="text-white text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-6 lg:mb-8 px-4 sm:px-0 italic">
          &ldquo;Study to show thyself approved unto God, a workman that
          needeth not to be ashamed, rightly dividing the word of truth.&rdquo;
          <br />
          <span className="text-brand-gold-400 font-semibold not-italic text-sm mt-2 inline-block">
            — 2 Timothy 2:15
          </span>
        </p>

        {/* Gold divider */}
        <div className="flex items-center justify-center mb-6 lg:mb-8">
          <div className="h-1 w-24 lg:w-32 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4">
          <Link
            href="/bible-school/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 lg:px-10 lg:py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base lg:text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
              />
            </svg>
            Register Now
          </Link>

          <Link
            href="/bible-school/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 lg:px-10 lg:py-4 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 text-white font-bold text-base lg:text-lg hover:border-brand-gold-400 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Student Login
          </Link>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-sm text-brand-purple-200 mt-8 lg:mt-10">
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
          <span className="text-brand-gold-400 font-semibold">Bible School</span>
        </nav>
      </div>
    </section>
  );
}