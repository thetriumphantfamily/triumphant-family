// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JOIN US CTA — No top icon
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { CONTACT, SERVICES } from "@/lib/constants";

// White 3D metallic effect for icons
const ICON_3D_STYLE = {
  color: "#ffffff",
  filter: "drop-shadow(0 2px 0 #e0e0e0) drop-shadow(0 3px 0 #cccccc) drop-shadow(0 4px 6px rgba(0,0,0,0.4)) drop-shadow(0 6px 15px rgba(255,255,255,0.15))",
};

export default function JoinUsCTA() {
  const sundayService    = SERVICES.find((s) => s.day === "Sunday");
  const wednesdayService = SERVICES.find((s) => s.day === "Wednesday");

  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Outer wrapper card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-10 text-center">

          {/* Gold top bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="relative z-10 max-w-3xl mx-auto">

            {/* Badge */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
                  You Belong Here
                </span>
              </div>
            </div>

            {/* Heading — WHITE gradient */}
            <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Become Part of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                The Triumphant Family
              </span>
            </h2>

            <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed mb-6">
              Whether you join us in our auditorium in{" "}
              <span className="text-white font-semibold">{CONTACT.address.city}</span>{" "}
              or stream from anywhere in the world — you are welcome, you are loved,
              and you are family.
            </p>

            {/* Gold divider */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>

            {/* SERVICE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-3">

              {/* Sunday Card */}
              <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-4 border border-brand-gold-400/40 hover:border-brand-gold-400 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">

                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="relative z-10 flex items-center gap-3 text-left">
                  {/* Icon — WHITE 3D no bg box */}
                  <div className="flex-shrink-0 group-hover:scale-110 transition-all duration-300" style={ICON_3D_STYLE}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      Sunday Worship
                    </p>
                    <p className="text-white font-heading text-lg lg:text-xl font-bold leading-none mb-1">
                      {sundayService?.time ?? "8:00 AM"}
                    </p>
                    <p className="text-brand-purple-200 text-xs">Every Sunday</p>
                  </div>
                </div>
              </div>

              {/* Wednesday Card */}
              <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-4 border border-brand-gold-400/40 hover:border-brand-gold-400 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">

                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="relative z-10 flex items-center gap-3 text-left">
                  {/* Icon — WHITE 3D no bg box */}
                  <div className="flex-shrink-0 group-hover:scale-110 transition-all duration-300" style={ICON_3D_STYLE}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      Midweek Service
                    </p>
                    <p className="text-white font-heading text-lg lg:text-xl font-bold leading-none mb-1">
                      {wednesdayService?.time ?? "9:00 AM"}
                    </p>
                    <p className="text-brand-purple-200 text-xs">Every Wednesday</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location card */}
            <div className="max-w-xl mx-auto mb-6">
              <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-4 border border-brand-gold-400/40 hover:border-brand-gold-400 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">

                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="relative z-10 flex items-center gap-3 text-left">
                  {/* Icon — WHITE 3D no bg box */}
                  <div className="flex-shrink-0 group-hover:scale-110 transition-all duration-300" style={ICON_3D_STYLE}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-0.5">
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

            {/* CTAs — WHITE gradient */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">

              <Link
                href="/live"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Live
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Visit Us
              </Link>
            </div>

            {/* Tagline */}
            <p className="mt-6 font-heading italic font-bold text-brand-gold-400 text-lg md:text-xl">
              Pray with us. Triumph with us.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}