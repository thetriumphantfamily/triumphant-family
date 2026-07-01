import { Calendar, Clock, Globe } from "lucide-react";

const SCHEDULE = [
  {
    day: "Sunday",
    name: "Sunday Worship Service",
    time: "8:00 AM",
    timezone: "WAT (West Africa Time)",
    description:
      "Powerful worship, anointed Word, prophetic declarations, and divine encounters every Sunday.",
    emoji: "🌅",
    color: "from-brand-gold-400 to-brand-gold-600",
  },
  {
    day: "Wednesday",
    name: "Midweek Prayer & Word",
    time: "9:00 AM",
    timezone: "WAT (West Africa Time)",
    description:
      "Mid-week refreshing — explosive prayer, prophetic teaching, and supernatural breakthroughs.",
    emoji: "🕊️",
    color: "from-violet-500 to-purple-700",
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
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-purple-100 text-brand-purple-600 text-sm font-bold tracking-widest uppercase mb-4">
            Live Schedule
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
            When We Go{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Live
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-lg">
            Mark your calendar! We stream every service live so you never miss
            a moment.
          </p>
        </div>

        {/* Service Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {SCHEDULE.map((service) => (
            <div
              key={service.day}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-5xl mb-4">{service.emoji}</div>

              <div
                className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${service.color} text-white text-xs font-bold tracking-widest uppercase mb-3`}
              >
                {service.day}
              </div>

              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                {service.name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-brand-purple-600" />
                <span className="text-brand-purple-600 font-bold text-xl">
                  {service.time}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500 text-sm">
                  {service.timezone}
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Time Zone Converter */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-6 md:p-10 border border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-brand-purple-600" />
              <h3 className="text-2xl font-heading font-bold text-gray-900">
                Sunday Service in Your Timezone
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TIMEZONES.map((tz) => (
                <div
                  key={tz.city}
                  className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:border-brand-purple-300 transition-colors"
                >
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    {tz.offset}
                  </p>
                  <p className="text-gray-900 font-bold text-sm mb-1">
                    {tz.city}
                  </p>
                  <p className="text-brand-purple-600 font-bold text-lg">
                    {tz.time}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 bg-brand-gold-50 rounded-xl p-4 border border-brand-gold-200 mt-6">
              <Calendar className="w-5 h-5 text-brand-gold-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 text-sm">
                <span className="font-bold">Pro tip:</span> Set a recurring
                reminder on your phone so you never miss a service. The
                anointing flows fresh every time!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}