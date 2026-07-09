// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY HERO — 3-photo G.O. rotating gallery (clean, no blobs)
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

export default function GalleryHero() {
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
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 min-h-[380px] md:min-h-[520px] lg:min-h-[600px] flex items-center">

      {/* MOBILE: single rotating photo */}
      <div className="absolute inset-0 z-0 md:hidden">
        {renderMobilePhotoLayer(activeIndex)}
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      {/* DESKTOP: 3 photos side-by-side */}
      <div className="absolute inset-0 z-0 hidden md:grid md:grid-cols-3">
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

        {/* Gold camera icon */}
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
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            />
          </svg>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 lg:px-6 lg:py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Precious Moments
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 lg:mb-4">
          Ministry{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
            Gallery
          </span>
        </h1>

        {/* Description */}
        <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-5 lg:mb-6 px-2 sm:px-0">
          Relive glorious moments from our services, prayer meetings, events,
          and outreach programs. Every picture tells a story of God&rsquo;s
          faithfulness.
        </p>

        {/* Gold divider */}
        <div className="flex items-center justify-center mb-4 lg:mb-6">
          <div className="h-1 w-20 lg:w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
        </div>

        {/* Tagline */}
        <p className="font-script text-brand-gold-400 text-lg md:text-2xl mb-6 lg:mb-8">
          Captured by grace. Preserved in love.
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
          <span className="text-brand-gold-400 font-semibold">Gallery</span>
        </nav>
      </div>
    </section>
  );
}