// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE SCHEDULE — Clean (no blurs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SCHEDULE = [
  {
    day:         "Sunday",
    name:        "Sunday Worship Service",
    time:        "8:00 AM",
    timezone:    "WAT (West Africa Time)",
    description: "Powerful worship, anointed Word, prophetic declarations, and divine encounters every Sunday.",
    emoji:       "🌅",
  },
  {
    day:         "Wednesday",
    name:        "Midweek Prayer & Word",
    time:        "9:00 AM",
    timezone:    "WAT (West Africa Time)",
    description: "Mid-week refreshing — explosive prayer, prophetic teaching, and supernatural breakthroughs.",
    emoji:       "🕊️",
  },
];

const TIMEZONES = [
  { city: "Lagos / Abuja", offset: "GMT+1",  time: "8:00 AM" },
  { city: "London",        offset: "GMT+0",  time: "7:00 AM" },
  { city: "New York",      offset: "GMT-5",  time: "2:00 AM" },
  { city: "Los Angeles",   offset: "GMT-8",  time: "11:00 PM (Sat)" },
  { city: "Dubai",         offset: "GMT+4",  time: "11:00 AM" },
  { city: "Sydney",        offset: "GMT+11", time: "6:00 PM" },
];

export default function LiveScheduleSection() {
  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Live Schedule
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            When We Go{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Live
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            Mark your calendar! We stream every service live so you never miss a moment.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {SCHEDULE.map((service) => (
            <div
              key={service.day}
              className="group relative rounded-2xl p-8 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gold top bar */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="relative z-10">
                {/* Emoji */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.emoji}
                </div>

                {/* Day badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400 animate-pulse" />
                  <span className="text-brand-gold-300 font-semibold text-xs uppercase tracking-widest">
                    {service.day}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-heading text-2xl font-bold text-white mb-3">
                  {service.name}
                </h3>

                {/* Time */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                    <svg className="w-4 h-4 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-brand-gold-400 font-bold text-2xl">
                    {service.time}
                  </span>
                </div>

                {/* Timezone */}
                <div className="flex items-center gap-2 mb-4 pl-10">
                  <svg className="w-4 h-4 text-brand-purple-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
                  </svg>
                  <span className="text-brand-purple-200 text-sm">
                    {service.timezone}
                  </span>
                </div>

                {/* Description */}
                <p className="text-brand-purple-100 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Timezone Converter */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-6 md:p-10 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 overflow-hidden">

            {/* Gold top bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-bold text-white">
                  Sunday Service in Your Timezone
                </h3>
              </div>

              {/* Timezone grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TIMEZONES.map((tz) => (
                  <div
                    key={tz.city}
                    className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-xl p-4 text-center border border-brand-gold-400/30 hover:border-brand-gold-400 transition-all"
                  >
                    <p className="text-brand-gold-400 text-xs uppercase tracking-widest mb-1 font-semibold">
                      {tz.offset}
                    </p>
                    <p className="text-white font-bold text-sm mb-1">
                      {tz.city}
                    </p>
                    <p className="text-brand-gold-300 font-bold text-lg">
                      {tz.time}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pro tip */}
              <div className="flex items-start gap-3 bg-brand-gold-400/10 border border-brand-gold-400/40 rounded-xl p-4 mt-6">
                <svg className="w-5 h-5 text-brand-gold-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
                <p className="text-brand-purple-100 text-sm">
                  <span className="font-bold text-brand-gold-400">Pro tip:</span>{" "}
                  Set a recurring reminder on your phone so you never miss a service. The anointing flows fresh every time!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}