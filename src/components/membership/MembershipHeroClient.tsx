// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBERSHIP HERO CLIENT — White gradient + no top icon + white buttons
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
            alt="Membership"
            loading={i === 0 ? "eager" : "lazy"}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}
    </>
  );

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 min-h-[420px] md:min-h-[520px] lg:min-h-[580px] flex items-center">
      {/* MOBILE */}
      <div className="absolute inset-0 z-0 md:hidden">
        {renderPhotoLayer(activeIndex)}
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      {/* DESKTOP */}
      <div className="absolute inset-0 z-0 hidden md:grid md:grid-cols-3">
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(0))}</div>
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(1))}</div>
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(2))}</div>
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      <div className="relative z-20 container-custom text-center py-10 lg:py-16 w-full px-4">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 lg:px-6 lg:py-2.5 rounded-full bg-brand-purple-900/60 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs uppercase tracking-widest">
              Membership Portal
            </span>
          </div>
        </div>

        {/* Title — WHITE gradient */}
        <h1 className="font-heading text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 lg:mb-4">
          Join{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
            The Family
          </span>
        </h1>

        {/* Tagline */}
        <p className="font-heading italic font-bold text-brand-gold-400 text-lg md:text-2xl mb-3 lg:mb-4">
          Pray with us. Triumph with us.
        </p>

        {/* Description */}
        <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-5 lg:mb-6">
          Register as a member or login to your portal to access prayer,
          devotionals, sermons, giving, events, fellowship, and your journey
          within The Triumphant Family.
        </p>

        <div className="flex items-center justify-center mb-5 lg:mb-6">
          <div className="h-1 w-20 lg:w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
        </div>

        {/* CTA Buttons — WHITE gradient */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
          <Link
            href="/join-church"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all"
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
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-black hover:border-brand-gold-400 transition-all"
          >
            Member Login
          </Link>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-sm text-brand-purple-200">
          <Link href="/" className="hover:text-white transition-colors">
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
          <span className="text-white font-semibold">Membership</span>
        </nav>
      </div>
    </section>
  );
}