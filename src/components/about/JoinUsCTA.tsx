// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JOIN US CTA — Bottom call-to-action banner
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { CONTACT, SERVICES } from "@/lib/constants";

export default function JoinUsCTA() {
  // ━━━ Find services by day (SERVICES is an array) ━━━
  const sundayService = SERVICES.find((s) => s.day === "Sunday");
  const wednesdayService = SERVICES.find((s) => s.day === "Wednesday");

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple-700 via-brand-purple-800 to-brand-violet-900 p-10 md:p-16 text-center text-white">

          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-brand-gold-400/15 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-brand-magenta-500/15 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-gold-400/40 bg-brand-gold-400/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
              <span className="text-brand-gold-300 font-bold text-sm uppercase tracking-widest">
                You Belong Here
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Become Part of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 to-brand-gold-500">
                The Triumphant Family
              </span>
            </h2>

            <p className="text-brand-purple-200 text-base md:text-lg leading-relaxed mb-8">
              Whether you join us in our auditorium in {CONTACT.address.city} or
              stream from anywhere in the world — you are welcome, you are loved,
              and you are family.
            </p>

            {/* Service info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                <p className="text-brand-gold-400 font-bold text-xs uppercase tracking-wider mb-2">
                  Sunday Service
                </p>
                <p className="text-white font-heading text-xl font-bold">
                  {sundayService?.time || "8:00 AM"}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                <p className="text-brand-gold-400 font-bold text-xs uppercase tracking-wider mb-2">
                  Midweek Service
                </p>
                <p className="text-white font-heading text-xl font-bold">
                  {wednesdayService?.time || "9:00 AM"}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/live"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Live
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                Visit Us
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>

            {/* Tagline */}
            <p className="mt-10 font-script text-brand-gold-400 text-2xl">
              Pray with us. Triumph with us.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}