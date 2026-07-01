// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GIVING TYPES SECTION — 6 giving type cards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const GIVING_TYPES = [
  {
    emoji: "🌾",
    title: "Tithes",
    description:
      "The tithe is the first 10% of your income returned to God as an act of obedience, worship, and trust. It opens the windows of heaven over your life.",
    scripture: "Malachi 3:10",
  },
  {
    emoji: "🎁",
    title: "Offerings",
    description:
      "Offerings are voluntary gifts given above your tithe as an expression of gratitude and love to God. Give from a cheerful and willing heart.",
    scripture: "2 Corinthians 9:7",
  },
  {
    emoji: "🌱",
    title: "Seed Faith",
    description:
      "A seed of faith is a deliberate act of giving in expectation of a divine harvest. When you sow into good ground, God multiplies your seed.",
    scripture: "2 Corinthians 9:10",
  },
  {
    emoji: "🏗️",
    title: "Project Giving",
    description:
      "Partner with us in building projects — church infrastructure, media equipment, outreach programs — that expand the Kingdom of God.",
    scripture: "Haggai 1:8",
  },
  {
    emoji: "🌍",
    title: "Missions & Outreach",
    description:
      "Support our global mission work — evangelism, community outreach, and spreading the gospel to unreached communities across nations.",
    scripture: "Mark 16:15",
  },
  {
    emoji: "🙏",
    title: "Thanksgiving",
    description:
      "Give a special thanksgiving offering to celebrate God's goodness, answered prayers, miracles, and breakthroughs in your life.",
    scripture: "Psalm 100:4",
  },
];

export default function GivingTypesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
            <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
              Ways To Give
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-4">
            Types of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Giving
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            There are many ways to partner with God through The Triumphant
            Family. Choose how you want to sow your seed today.
          </p>
        </div>

        {/* Cards grid — All purple themed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GIVING_TYPES.map((type) => (
            <div
              key={type.title}
              className="relative rounded-2xl p-6 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 text-white shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-brand-gold-400/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Decorative blobs */}
              <div className="absolute top-[-30%] right-[-20%] w-48 h-48 rounded-full bg-brand-magenta-500/20 blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-30%] left-[-20%] w-48 h-48 rounded-full bg-brand-gold-400/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Emoji */}
                <div className="text-5xl mb-4">{type.emoji}</div>

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