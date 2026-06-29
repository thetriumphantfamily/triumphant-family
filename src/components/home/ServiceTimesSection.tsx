// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICE TIMES SECTION — Sunday + Wednesday info + location
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";
import { CONTACT, SERVICES } from "@/lib/constants";

const SERVICES_LIST = [
  {
    day:         "Sunday",
    name:        "Sunday Worship Service",
    time:        SERVICES.sunday,
    description: "Spirit-filled praise, powerful preaching of God's Word, and miraculous encounters.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
      </svg>
    ),
  },
  {
    day:         "Wednesday",
    name:        "Midweek Prayer & Word",
    time:        SERVICES.wednesday,
    description: "Deep intercession, prophetic ministry, and midweek spiritual recharging.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/>
      </svg>
    ),
  },
];

export default function ServiceTimesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-purple-900 via-brand-purple-800 to-brand-violet-900 relative overflow-hidden">

      {/* ── Background decoration ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-gold-400/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-magenta-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Heading + info ── */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold-400/15 border border-brand-gold-400/30 mb-6">
              <span className="text-brand-gold-400 font-bold text-xs uppercase tracking-widest">
                Join Us In Person or Online
              </span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
              Come &amp; Experience{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 to-brand-gold-500">
                God&rsquo;s Presence
              </span>
            </h2>

            <p className="text-brand-purple-200 text-base md:text-lg leading-relaxed mb-8">
              Whether you join us in our auditorium in {CONTACT.address.city}, {CONTACT.address.state}, or stream
              online from anywhere in the world — you will encounter God.
            </p>

            {/* Address card */}
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-gold-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-brand-gold-400 font-bold text-sm uppercase tracking-wider mb-1">Our Location</p>
                <p className="text-white font-medium">{CONTACT.address.full}</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/live"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold hover:scale-105 transition-all duration-300 shadow-gold"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Online Live
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                Get Directions
              </Link>
            </div>
          </div>

          {/* ── Right: Service cards ── */}
          <div className="space-y-5">
            {SERVICES_LIST.map((service, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-7 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center text-brand-purple-900 flex-shrink-0 shadow-gold group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                      <h3 className="font-heading text-xl font-bold text-white">
                        {service.name}
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold uppercase tracking-wider">
                        {service.day}
                      </span>
                    </div>
                    <p className="text-brand-gold-400 font-bold text-lg mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {service.time}
                    </p>
                    <p className="text-brand-purple-200 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Online note */}
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-400/30 rounded-2xl p-4">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <p className="text-green-300 text-sm font-medium">
                All services are also streamed live on YouTube &amp; Facebook. Join from anywhere!
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}