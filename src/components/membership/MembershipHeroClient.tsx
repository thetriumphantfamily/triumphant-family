// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBERSHIP HERO CLIENT – Rotating hero photos + membership CTA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MembershipHeroClientProps {
  photos: string[];
}

export default function MembershipHeroClient({
  photos,
}: MembershipHeroClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalPhotos = photos.length;

  useEffect(() => {
    if (totalPhotos <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalPhotos);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalPhotos]);

  const getPhotoIndex = (offset: number) => (activeIndex + offset) % totalPhotos;

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
            alt="The Triumphant Family Membership"
            loading={i === 0 ? "eager" : "lazy"}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}
    </>
  );

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 min-h-[420px] md:min-h-[560px] lg:min-h-[640px] flex items-center">
      {/* MOBILE: single rotating photo */}
      <div className="absolute inset-0 z-0 md:hidden">
        {renderPhotoLayer(activeIndex)}
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      {/* DESKTOP: 3 photos side-by-side */}
      <div className="absolute inset-0 z-0 hidden md:grid md:grid-cols-3">
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(0))}</div>
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(1))}</div>
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(2))}</div>
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom text-center py-10 lg:py-24 w-full px-4">
        {/* Gold icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 shadow-gold mb-4 lg:mb-6">
          <svg
            className="w-7 h-7 lg:w-10 lg:h-10 text-brand-purple-900"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 7.5V6a4.5 4.5 0 10-9 0v1.5M4.5 21h15a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0019.5 7.5h-15A2.25 2.25 0 002.25 9.75v9A2.25 2.25 0 004.5 21zm7.5-6.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
            />
          </svg>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 lg:px-6 lg:py-2.5 rounded-full bg-brand-purple-900/60 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs uppercase tracking-widest">
              Membership Portal
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 lg:mb-4">
          Join{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
            The Family
          </span>
        </h1>

        {/* Tagline */}
        <p className="font-script text-brand-gold-400 text-xl md:text-3xl mb-4 lg:mb-5">
          Pray with us. Triumph with us.
        </p>

        {/* Description */}
        <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-6 lg:mb-8">
          Register as a member or login to your portal to access prayer,
          devotionals, sermons, giving, events, fellowship, and your journey
          within The Triumphant Family.
        </p>

        {/* Gold divider */}
        <div className="flex items-center justify-center mb-5 lg:mb-8">
          <div className="h-1 w-20 lg:w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
          <Link
            href="/join-church"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
          >
            Register Now
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="/member/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-black hover:border-brand-gold-400 transition-all"
          >
            Member Login
          </Link>
        </div>

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-brand-gold-400 font-semibold">Membership</span>
        </nav>
      </div>
    </section>
  );
}