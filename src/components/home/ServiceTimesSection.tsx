// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICE TIMES SECTION — Both CTAs gold gradient (matching)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { CONTACT, SERVICES } from "@/lib/constants";

const sundayService    = SERVICES.find((s) => s.day === "Sunday");
const wednesdayService = SERVICES.find((s) => s.day === "Wednesday");

export default function ServiceTimesSection() {
  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Badge — same gradient + gold border */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Join Us In Person or Online
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8 lg:mb-10 max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3 lg:whitespace-nowrap">
            Come &amp; Experience{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              God&rsquo;s Presence
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
            Whether you join us in our auditorium in {CONTACT.address.city}, {CONTACT.address.state},
            or stream online from anywhere in the world — you will encounter God.
          </p>

          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* 4 EQUAL CARDS — SAME GRADIENT + GOLD BORDER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-6xl mx-auto mb-8">

          {/* CARD 1: LOCATION */}
          <div className="group bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 rounded-3xl p-6 lg:p-7 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="flex items-start gap-4 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-brand-gold-400 font-bold text-xs uppercase tracking-widest mb-2">
                  Our Location
                </p>
                <p className="text-white font-semibold text-base lg:text-lg leading-relaxed">
                  {CONTACT.address.full}
                </p>
              </div>
            </div>
          </div>

          {/* CARD 2: SUNDAY SERVICE */}
          <div className="group bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 rounded-3xl p-6 lg:p-7 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="flex items-start gap-4 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <p className="text-brand-gold-400 font-bold text-xs uppercase tracking-widest">
                    Sunday Service
                  </p>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 text-[10px] font-bold uppercase tracking-wider">
                    Sunday
                  </span>
                </div>
                <p className="text-brand-gold-400 font-heading font-bold text-xl lg:text-2xl mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {sundayService?.time || "8:00 AM"}
                </p>
                <p className="text-brand-purple-100 text-sm leading-relaxed">
                  Spirit-filled praise, powerful preaching of God&rsquo;s Word, and miraculous encounters.
                </p>
              </div>
            </div>
          </div>

          {/* CARD 3: ALSO LIVE ONLINE */}
          <div className="group bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 rounded-3xl p-6 lg:p-7 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="flex items-start gap-4 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-brand-gold-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                  Also Live Online
                </p>
                <p className="text-white font-semibold text-base lg:text-lg leading-relaxed">
                  All services are streamed live on YouTube &amp; Facebook. Join us from anywhere!
                </p>
              </div>
            </div>
          </div>

          {/* CARD 4: WEDNESDAY SERVICE */}
          <div className="group bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 rounded-3xl p-6 lg:p-7 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="flex items-start gap-4 h-full">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <p className="text-brand-gold-400 font-bold text-xs uppercase tracking-widest">
                    Midweek Service
                  </p>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 text-[10px] font-bold uppercase tracking-wider">
                    Wednesday
                  </span>
                </div>
                <p className="text-brand-gold-400 font-heading font-bold text-xl lg:text-2xl mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {wednesdayService?.time || "9:00 AM"}
                </p>
                <p className="text-brand-purple-100 text-sm leading-relaxed">
                  Deep intercession, prophetic ministry, and midweek spiritual recharging.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* CTAs — BOTH GOLD GRADIENT */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center max-w-md mx-auto">

          {/* Watch Online Live */}
          <Link
            href="/live"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Online Live
          </Link>

          {/* Get Directions — GOLD GRADIENT (matching) */}
          <Link
            href="/contact"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Get Directions
          </Link>
        </div>

      </div>
    </section>
  );
}