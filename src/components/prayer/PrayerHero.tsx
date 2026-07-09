// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER HERO — 3-photo G.O. rotating gallery (clean, no blobs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const GO_PHOTOS = [
  "/images/hero/prophet-1.png",
  "/images/hero/prophet-2.png",
  "/images/hero/prophet-3.png",
  "/images/hero/prophet-4.png",
];

export default function PrayerHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalPhotos = GO_PHOTOS.length;

  useEffect(() => {
    if (totalPhotos <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalPhotos);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalPhotos]);

  const getPhotoIndex = (offset: number) =>
    (activeIndex + offset) % totalPhotos;

  const renderMobilePhotoLayer = (currentIndex: number) => (
    <>
      {GO_PHOTOS.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt="Prophet Olayiwole Ogunsola"
            loading={i === 0 ? "eager" : "lazy"}
            className="w-full h-full object-cover"
            style={{ objectPosition: "40% top" }}
          />
        </div>
      ))}
    </>
  );

  const renderDesktopPhotoLayer = (currentIndex: number) => (
    <>
      {GO_PHOTOS.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt="Prophet Olayiwole Ogunsola"
            loading={i === 0 ? "eager" : "lazy"}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}
    </>
  );

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 min-h-[380px] sm:min-h-[420px] lg:min-h-[600px] flex items-center">
      {/* MOBILE + TABLET: single rotating photo */}
      <div className="absolute inset-0 z-0 lg:hidden">
        {renderMobilePhotoLayer(activeIndex)}
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      {/* DESKTOP: 3 photos side-by-side */}
      <div className="absolute inset-0 z-0 hidden lg:grid lg:grid-cols-3">
        <div className="relative overflow-hidden">
          {renderDesktopPhotoLayer(getPhotoIndex(0))}
        </div>
        <div className="relative overflow-hidden">
          {renderDesktopPhotoLayer(getPhotoIndex(1))}
        </div>
        <div className="relative overflow-hidden">
          {renderDesktopPhotoLayer(getPhotoIndex(2))}
        </div>
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom text-center py-10 lg:py-24 w-full">
        {/* Gold icon circle */}
        <div className="inline-flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-4 lg:mb-6">
          <svg
            className="w-7 h-7 lg:w-10 lg:h-10 text-brand-purple-900"
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
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 lg:px-6 lg:py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              We Pray With You
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-2xl md:text-4xl lg:text-6xl font-bold text-white leading-tight mb-3 lg:mb-4">
          Submit a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
            Prayer Request
          </span>
        </h1>

        {/* Description */}
        <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-5 lg:mb-6 px-2 sm:px-0">
          You are not alone. Share what is on your heart, and let The Triumphant
          Family stand in agreement with you. We believe in the power of united
          prayer.
        </p>

        {/* Gold divider */}
        <div className="flex items-center justify-center mb-5 lg:mb-6">
          <div className="h-1 w-20 lg:w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
        </div>

        {/* Scripture */}
        <p className="font-script text-brand-gold-400 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-2 px-2 sm:px-0">
          &ldquo;Again I say to you, if two of you agree on earth about anything
          they ask, it will be done for them by my Father in heaven.&rdquo;
        </p>
        <p className="text-brand-purple-200 text-sm font-semibold mb-6 lg:mb-8">
          — Matthew 18:19
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
          <span className="text-brand-gold-400 font-semibold">Prayer</span>
        </nav>
      </div>
    </section>
  );
}