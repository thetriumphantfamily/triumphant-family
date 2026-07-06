// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ABOUT HERO — 3-photo G.O. rotating gallery wall + breadcrumb (FIXED)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const GO_PHOTOS = [
  "/images/hero/prophet-1.png",
  "/images/hero/prophet-2.png",
  "/images/hero/prophet-3.png",
  "/images/hero/prophet-4.png",
];

export default function AboutHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalPhotos = GO_PHOTOS.length;

  useEffect(() => {
    if (totalPhotos <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalPhotos);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalPhotos]);

  const getPhotoIndex = (offset: number) => {
    return (activeIndex + offset) % totalPhotos;
  };

  const renderPhotoLayer = (currentIndex: number) => (
    <>
      {GO_PHOTOS.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt="Prophet Olayiwole Ogunsola"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={i === 0}
          />
        </div>
      ))}
    </>
  );

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 min-h-[520px] lg:min-h-[600px] flex items-center">
      {/* MOBILE: single rotating photo */}
      <div className="absolute inset-0 z-0 md:hidden">
        {renderPhotoLayer(activeIndex)}
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      {/* DESKTOP: 3 photos side-by-side */}
      <div className="absolute inset-0 z-0 hidden md:grid md:grid-cols-3">
        <div className="relative overflow-hidden">
          {renderPhotoLayer(getPhotoIndex(0))}
        </div>

        <div className="relative overflow-hidden">
          {renderPhotoLayer(getPhotoIndex(1))}
        </div>

        <div className="relative overflow-hidden">
          {renderPhotoLayer(getPhotoIndex(2))}
        </div>

        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute inset-0 z-[11] pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold-400/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-brand-magenta-500/15 blur-3xl" />
        <div className="absolute top-0 right-10 w-px h-full bg-gradient-to-b from-brand-gold-400/30 to-transparent rotate-12" />
        <div className="absolute top-0 right-40 w-px h-full bg-gradient-to-b from-brand-magenta-500/20 to-transparent rotate-12" />
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom text-center py-16 lg:py-24 w-full">
        {/* Gold icon circle */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-6">
          <svg
            className="w-9 h-9 text-brand-purple-900"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Get to Know Us
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
          About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
            The Triumphant Family
          </span>
        </h1>

        {/* Tagline */}
        <p className="font-script text-brand-gold-400 text-2xl md:text-3xl mb-5">
          Pray with us. Triumph with us.
        </p>

        {/* Description */}
        <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          A global ministry of prayer, prophecy, and power — raised by God to bring
          salvation, healing, deliverance, and unstoppable triumph to His people.
        </p>

        {/* Gold divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
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
          <span className="text-brand-gold-400 font-semibold">About</span>
        </nav>
      </div>
    </section>
  );
}