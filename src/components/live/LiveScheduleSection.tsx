// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE SCHEDULE SECTION — Service times + timezone converter
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SCHEDULE = [
  {
    day: "Sunday",
    name: "Sunday Worship Service",
    time: "8:00 AM",
    timezone: "WAT (West Africa Time)",
    description:
      "Powerful worship, anointed Word, prophetic declarations, and divine encounters every Sunday.",
    emoji: "🌅",
  },
  {
    day: "Wednesday",
    name: "Midweek Prayer & Word",
    time: "9:00 AM",
    timezone: "WAT (West Africa Time)",
    description:
      "Mid-week refreshing — explosive prayer, prophetic teaching, and supernatural breakthroughs.",
    emoji: "🕊️",
  },
];

const TIMEZONES = [
  { city: "Lagos / Abuja", offset: "GMT+1", time: "8:00 AM" },
  { city: "London", offset: "GMT+0", time: "7:00 AM" },
  { city: "New York", offset: "GMT-5", time: "2:00 AM" },
  { city: "Los Angeles", offset: "GMT-8", time: "11:00 PM (Sat)" },
  { city: "Dubai", offset: "GMT+4", time: "11:00 AM" },
  { city: "Sydney", offset: "GMT+11", time: "6:00 PM" },
];

export default function LiveScheduleSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
            <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
              Live Schedule
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-4">
            When We Go{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Live
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            Mark your calendar! We stream every service live so you never miss
            a moment.
          </p>
        </div>

        {/* Service Schedule Cards — PURPLE THEME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {SCHEDULE.map((service) => (
            <div
              key={service.day}
              className="relative rounded-2xl p-8 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 text-white shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-brand-gold-400/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Decorative blobs */}
              <div className="absolute top-[-30%] right-[-20%] w-64 h-64 rounded-full bg-brand-magenta-500/20 blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-30%] left-[-20%] w-64 h-64 rounded-full bg-brand-gold-400/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Emoji */}
                <div className="text-5xl mb-4">{service.emoji}</div>

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
                    <svg
                      className="w-4 h-4 text-brand-purple-900"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-brand-gold-400 font-bold text-2xl">
                    {service.time}
                  </span>
                </div>

                {/* Timezone */}
                <div className="flex items-center gap-2 mb-4 pl-10">
                  <svg
                    className="w-4 h-4 text-brand-purple-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
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

        {/* Time Zone Converter — PURPLE THEME */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-6 md:p-10 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 shadow-xl overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-[-30%] right-[-20%] w-64 h-64 rounded-full bg-brand-magenta-500/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-30%] left-[-20%] w-64 h-64 rounded-full bg-brand-gold-400/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-purple-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247"
                    />
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
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-white/20 hover:border-brand-gold-400/50 hover:bg-white/15 transition-all"
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
              <div className="flex items-start gap-3 bg-brand-gold-400/10 border-2 border-brand-gold-400/30 rounded-xl p-4 mt-6">
                <svg
                  className="w-5 h-5 text-brand-gold-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
                  />
                </svg>
                <p className="text-brand-purple-100 text-sm">
                  <span className="font-bold text-brand-gold-400">
                    Pro tip:
                  </span>{" "}
                  Set a recurring reminder on your phone so you never miss a
                  service. The anointing flows fresh every time!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}