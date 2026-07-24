// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE HERO CLIENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LiveHeroClientProps {
  photos: string[];
}

export default function LiveHeroClient({ photos }: LiveHeroClientProps) {
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
        <div key={src} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? "opacity-100" : "opacity-0"}`}>
          <img src={src} alt="Prophet Olayiwole Ogunsola" loading={i === 0 ? "eager" : "lazy"} className="w-full h-full object-cover object-top" />
        </div>
      ))}
    </>
  );

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 min-h-[380px] md:min-h-[520px] lg:min-h-[600px] flex items-center">
      <div className="absolute inset-0 z-0 md:hidden">
        {renderPhotoLayer(activeIndex)}
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      <div className="absolute inset-0 z-0 hidden md:grid md:grid-cols-3">
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(0))}</div>
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(1))}</div>
        <div className="relative overflow-hidden">{renderPhotoLayer(getPhotoIndex(2))}</div>
        <div className="absolute inset-0 z-10 bg-black/55" />
      </div>

      <div className="relative z-20 container-custom text-center py-10 lg:py-24 w-full">
        <div className="relative inline-flex items-center justify-center mb-4 lg:mb-6">
          <div className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" />
          <div className="relative w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
            <svg className="w-7 h-7 lg:w-10 lg:h-10 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
            </svg>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 lg:px-6 lg:py-2.5 rounded-full bg-gradient-to-br from-red-700 via-red-600 to-red-700 border border-red-400/60 shadow-lg">
            <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">🔴 Live Stream</span>
          </div>
        </div>

        <h1 className="font-heading text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 lg:mb-4">
          Watch{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">Live</span>
        </h1>

        <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-5 lg:mb-6 px-2 sm:px-0">
          Join us LIVE for powerful prayer, anointed worship, and prophetic declarations. Wherever you are in the world — you can connect!
        </p>

        <div className="flex items-center justify-center mb-4 lg:mb-6">
          <div className="h-1 w-20 lg:w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
        </div>

        <p className="font-script text-brand-gold-400 text-lg md:text-2xl mb-6 lg:mb-8">Pray with us. Triumph with us.</p>

        <nav className="flex items-center justify-center gap-2 text-sm text-brand-purple-200">
          <Link href="/" className="hover:text-brand-gold-400 transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-brand-gold-400 font-semibold">Live</span>
        </nav>
      </div>
    </section>
  );
}