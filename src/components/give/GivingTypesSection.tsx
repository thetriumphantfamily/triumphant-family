// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GIVING TYPES — Clean cards (no blurs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const GIVING_TYPES = [
  {
    emoji:       "🌾",
    title:       "Tithes",
    description: "The tithe is the first 10% of your income returned to God as an act of obedience, worship, and trust. It opens the windows of heaven over your life.",
    scripture:   "Malachi 3:10",
  },
  {
    emoji:       "🎁",
    title:       "Offerings",
    description: "Offerings are voluntary gifts given above your tithe as an expression of gratitude and love to God. Give from a cheerful and willing heart.",
    scripture:   "2 Corinthians 9:7",
  },
  {
    emoji:       "🌱",
    title:       "Seed Faith",
    description: "A seed of faith is a deliberate act of giving in expectation of a divine harvest. When you sow into good ground, God multiplies your seed.",
    scripture:   "2 Corinthians 9:10",
  },
  {
    emoji:       "🏗️",
    title:       "Project Giving",
    description: "Partner with us in building projects — church infrastructure, media equipment, outreach programs — that expand the Kingdom of God.",
    scripture:   "Haggai 1:8",
  },
  {
    emoji:       "🌍",
    title:       "Missions & Outreach",
    description: "Support our global mission work — evangelism, community outreach, and spreading the gospel to unreached communities across nations.",
    scripture:   "Mark 16:15",
  },
  {
    emoji:       "🙏",
    title:       "Thanksgiving",
    description: "Give a special thanksgiving offering to celebrate God's goodness, answered prayers, miracles, and breakthroughs in your life.",
    scripture:   "Psalm 100:4",
  },
];

export default function GivingTypesSection() {
  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Ways To Give
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Types of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Giving
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            There are many ways to partner with God through The Triumphant
            Family. Choose how you want to sow your seed today.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {GIVING_TYPES.map((type) => (
            <div
              key={type.title}
              className="group relative rounded-2xl p-6 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gold top bar */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="relative z-10">
                {/* Emoji */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {type.emoji}
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-bold text-white mb-3">
                  {type.title}
                </h3>

                {/* Description */}
                <p className="text-brand-purple-100 text-sm leading-relaxed mb-4">
                  {type.description}
                </p>

                {/* Scripture badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold-400/40 bg-brand-gold-400/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400" />
                  <span className="text-brand-gold-300 text-xs font-bold">
                    📖 {type.scripture}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}