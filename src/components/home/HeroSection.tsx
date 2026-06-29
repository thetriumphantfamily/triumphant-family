"use client";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO SECTION — Animated rotating words + main CTAs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState, useEffect } from "react";
import { Sparkles, Play } from "lucide-react";
import { HERO, SITE } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // ━━━ Rotate words every 2.5 seconds ━━━
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % HERO.rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-hero overflow-hidden">

      {/* ━━━ Decorative Blurred Blobs ━━━ */}
      <div className="absolute top-10 -left-32 w-96 h-96 bg-brand-magenta-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-brand-gold-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple-600/10 rounded-full blur-3xl"></div>

      {/* ━━━ Subtle grid pattern overlay ━━━ */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* ━━━ Hero Content ━━━ */}
      <div className="container-custom relative z-10 text-center py-20">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-gold-400/20 backdrop-blur-sm border border-brand-gold-400/40 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-brand-gold-300" />
          <span className="text-brand-gold-300 font-semibold tracking-wider text-xs md:text-sm uppercase">
            {HERO.badge}
          </span>
        </div>

        {/* Main Headline with Rotating Words */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight animate-slide-up">
          Experience the
          <br />
          <span className="relative inline-block min-w-[280px] md:min-w-[400px] lg:min-w-[500px]">
            {HERO.rotatingWords.map((word, index) => (
              <span
                key={word}
                className={`absolute left-1/2 -translate-x-1/2 text-gradient bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-magenta-400 bg-clip-text text-transparent transition-all duration-700 ${
                  index === currentWordIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                {word}
              </span>
            ))}
            {/* Invisible spacer to maintain height */}
            <span className="invisible">{HERO.rotatingWords[0]}</span>
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl font-script text-brand-gold-400 mb-6 animate-slide-up">
          {SITE.tagline}
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base md:text-lg text-brand-purple-100 leading-relaxed mb-10 animate-slide-up">
          {HERO.subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
          <Button
            variant="gold"
            size="lg"
            href={HERO.ctaPrimary.href}
            leftIcon={<span className="text-xl">🙏</span>}
          >
            {HERO.ctaPrimary.label}
          </Button>

          <Button
            variant="outline"
            size="lg"
            href={HERO.ctaSecondary.href}
            leftIcon={<Play className="w-5 h-5 fill-current" />}
            className="!text-white !border-white hover:!bg-white hover:!text-brand-purple-900"
          >
            {HERO.ctaSecondary.label}
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-float">
          <span className="text-brand-purple-200 text-xs uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-gold-400 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}