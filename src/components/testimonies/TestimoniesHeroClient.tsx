// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIES HERO CLIENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TestimoniesHeroClientProps {
  photos: string[];
}

export default function TestimoniesHeroClient({ photos }: TestimoniesHeroClientProps) {
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
        <div className="inline-flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-4 lg:mb-6">
          <svg className="w-7 h-7 lg:w-10 lg:h-10 text-brand-purple-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
          </svg>
        </div>

        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 lg:px-6 lg:py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">God&rsquo;s Faithfulness</span>
          </div>
        </div>

        <h1 className="font-heading text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 lg:mb-4">
          Testimonies of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">His Grace</span>
        </h1>

        <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-5 lg:mb-6 px-2 sm:px-0">
          Read the miracles, breakthroughs, and life-transforming encounters of God from members of The Triumphant Family. Share yours and inspire faith in others!
        </p>

        <div className="flex items-center justify-center mb-4 lg:mb-6">
          <div className="h-1 w-20 lg:w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
        </div>

        <p className="font-script text-brand-gold-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-2 px-2 sm:px-0">
          &ldquo;They overcame him by the blood of the Lamb, and by the word of their testimony.&rdquo;
        </p>
        <p className="text-brand-purple-200 text-sm font-semibold mb-6 lg:mb-8">— Revelation 12:11</p>

        <nav className="flex items-center justify-center gap-2 text-sm text-brand-purple-200">
          <Link href="/" className="hover:text-brand-gold-400 transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-brand-gold-400 font-semibold">Testimonies</span>
        </nav>
      </div>
    </section>
  );
}