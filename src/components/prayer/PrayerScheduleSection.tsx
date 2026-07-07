// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER SCHEDULE — When and how the ministry prays (clean, no blobs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PRAYER_TIMES = [
  {
    day:         "Sunday",
    name:        "Sunday Worship & Prayer",
    time:        "8:00 AM",
    description: "Powerful corporate prayer and worship service open to all.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    day:         "Wednesday",
    name:        "Midweek Prayer Service",
    time:        "9:00 AM",
    description: "Deep intercession and prophetic ministry for breakthrough.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    day:         "Daily",
    name:        "Personal Intercession",
    time:        "Always",
    description: "Our prayer team prays over every submitted request daily.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export default function PrayerScheduleSection() {
  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Prayer Schedule
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            We Pray{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Without Ceasing
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            Join us in prayer at any of our regular gatherings, or rest assured that
            our prayer team is constantly interceding.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Prayer cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRAYER_TIMES.map((prayer, i) => (
            <div
              key={i}
              className="group bg-white/10 backdrop-blur-md rounded-3xl p-6 lg:p-7 border-2 border-white/20 hover:border-brand-gold-400/60 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Gold top bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Gold icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 mb-5 group-hover:scale-110 transition-transform duration-300">
                {prayer.icon}
              </div>

              {/* Day badge */}
              <span className="inline-block px-3 py-1 rounded-full bg-brand-gold-400/15 border border-brand-gold-400/40 text-brand-gold-300 text-xs font-bold uppercase tracking-wider mb-3">
                {prayer.day}
              </span>

              {/* Title */}
              <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-3">
                {prayer.name}
              </h3>

              {/* Time */}
              <p className="text-brand-gold-400 font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {prayer.time}
              </p>

              {/* Description */}
              <p className="text-brand-purple-100 text-sm lg:text-base leading-relaxed">
                {prayer.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}