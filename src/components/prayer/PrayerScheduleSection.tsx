// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER SCHEDULE — When and how the ministry prays
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import SectionHeading from "@/components/ui/SectionHeading";

const PRAYER_TIMES = [
  {
    day:         "Sunday",
    name:        "Sunday Worship & Prayer",
    time:        "8:00 AM",
    description: "Powerful corporate prayer and worship service",
    icon:        "🌅",
  },
  {
    day:         "Wednesday",
    name:        "Midweek Prayer Service",
    time:        "9:00 AM",
    description: "Deep intercession and prophetic ministry",
    icon:        "🕊️",
  },
  {
    day:         "Daily",
    name:        "Personal Intercession",
    time:        "Always",
    description: "Our prayer team prays over every submitted request",
    icon:        "🙏",
  },
];

export default function PrayerScheduleSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-purple-900 via-brand-purple-800 to-brand-violet-900 relative overflow-hidden">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-gold-400/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-magenta-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 container-custom">

        {/* Heading */}
        <div className="mb-14">
          <SectionHeading
            badge="Prayer Schedule"
            title={
              <>
                We Pray{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 to-brand-gold-500">
                  Without Ceasing
                </span>
              </>
            }
            subtitle="Join us in prayer at any of our regular gatherings, or rest assured that our prayer team is constantly interceding."
            theme="light"
            withDivider
          />
        </div>

        {/* Prayer cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRAYER_TIMES.map((prayer, i) => (
            <div
              key={i}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {prayer.icon}
              </div>

              {/* Day badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 mb-3">
                <span className="text-brand-gold-300 text-xs font-bold uppercase tracking-wider">
                  {prayer.day}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                {prayer.name}
              </h3>

              {/* Time */}
              <p className="text-brand-gold-400 font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {prayer.time}
              </p>

              {/* Description */}
              <p className="text-brand-purple-200 text-sm leading-relaxed">
                {prayer.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}