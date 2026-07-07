// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JOIN US CTA — Compact, cute, attractive cards with polish
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { CONTACT, SERVICES } from "@/lib/constants";

export default function JoinUsCTA() {
  const sundayService    = SERVICES.find((s) => s.day === "Sunday");
  const wednesdayService = SERVICES.find((s) => s.day === "Wednesday");

  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Outer wrapper card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 md:p-12 text-center">

          {/* Gold top bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="relative z-10 max-w-3xl mx-auto">

            {/* Gold icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-6">
              <svg className="w-8 h-8 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
                  You Belong Here
                </span>
              </div>
            </div>

            {/* Heading */}
            <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-5">
              Become Part of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                The Triumphant Family
              </span>
            </h2>

            <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed mb-8">
              Whether you join us in our auditorium in{" "}
              <span className="text-white font-semibold">{CONTACT.address.city}</span>{" "}
              or stream from anywhere in the world — you are welcome, you are loved,
              and you are family.
            </p>

            {/* Gold divider */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>

            {/* ══════ COMPACT & CUTE SERVICE CARDS ══════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-4">

              {/* Sunday Card */}
              <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-5 border border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">

                {/* Gold top bar */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Shine sweep on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute -inset-x-full top-0 h-full bg-gradient-to-r from-transparent via-brand-gold-400/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <div className="relative z-10 flex items-center gap-4 text-left">
                  {/* Gold icon */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <svg className="w-5 h-5 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-brand-gold-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      Sunday Worship
                    </p>
                    <p className="text-white font-heading text-xl lg:text-2xl font-bold leading-none mb-1">
                      {sundayService?.time ?? "8:00 AM"}
                    </p>
                    <p className="text-brand-purple-200 text-xs">Every Sunday</p>
                  </div>
                </div>
              </div>

              {/* Wednesday Card */}
              <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-5 border border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">

                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute -inset-x-full top-0 h-full bg-gradient-to-r from-transparent via-brand-gold-400/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <div className="relative z-10 flex items-center gap-4 text-left">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <svg className="w-5 h-5 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-brand-gold-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      Midweek Service
                    </p>
                    <p className="text-white font-heading text-xl lg:text-2xl font-bold leading-none mb-1">
                      {wednesdayService?.time ?? "9:00 AM"}
                    </p>
                    <p className="text-brand-purple-200 text-xs">Every Wednesday</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location card — compact matching style */}
            <div className="max-w-xl mx-auto mb-10">
              <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-5 border border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">

                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute -inset-x-full top-0 h-full bg-gradient-to-r from-transparent via-brand-gold-400/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <div className="relative z-10 flex items-center gap-4 text-left">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <svg className="w-5 h-5 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-brand-gold-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      Our Location
                    </p>
                    <p className="text-white font-heading text-base lg:text-lg font-bold leading-tight mb-0.5">
                      1, Arifanla Bus Stop
                    </p>
                    <p className="text-brand-purple-200 text-xs lg:text-sm">
                      Akute, Ogun State, Nigeria
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs — BOTH GOLD GRADIENT */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link
                href="/live"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Live
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Visit Us
              </Link>
            </div>

            {/* Script tagline */}
            <p className="mt-10 font-script text-brand-gold-400 text-2xl">
              Pray with us. Triumph with us.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}