const GIVING_TYPES = [
  {
    emoji: "🌾",
    title: "Tithes",
    description:
      "The tithe is the first 10% of your income returned to God as an act of obedience, worship, and trust. It opens the windows of heaven over your life.",
    scripture: "Malachi 3:10",
    color: "border-brand-purple-300 bg-brand-purple-50",
    badge: "bg-brand-purple-100 text-brand-purple-700",
  },
  {
    emoji: "🎁",
    title: "Offerings",
    description:
      "Offerings are voluntary gifts given above your tithe as an expression of gratitude and love to God. Give from a cheerful and willing heart.",
    scripture: "2 Corinthians 9:7",
    color: "border-brand-gold-300 bg-brand-gold-50",
    badge: "bg-brand-gold-100 text-brand-gold-700",
  },
  {
    emoji: "🌱",
    title: "Seed Faith",
    description:
      "A seed of faith is a deliberate act of giving in expectation of a divine harvest. When you sow into good ground, God multiplies your seed.",
    scripture: "2 Corinthians 9:10",
    color: "border-green-300 bg-green-50",
    badge: "bg-green-100 text-green-700",
  },
  {
    emoji: "🏗️",
    title: "Project Giving",
    description:
      "Partner with us in building projects — church infrastructure, media equipment, outreach programs — that expand the Kingdom of God.",
    scripture: "Haggai 1:8",
    color: "border-blue-300 bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    emoji: "🌍",
    title: "Missions & Outreach",
    description:
      "Support our global mission work — evangelism, community outreach, and spreading the gospel to unreached communities across nations.",
    scripture: "Mark 16:15",
    color: "border-brand-magenta-300 bg-pink-50",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    emoji: "🙏",
    title: "Thanksgiving",
    description:
      "Give a special thanksgiving offering to celebrate God's goodness, answered prayers, miracles, and breakthroughs in your life.",
    scripture: "Psalm 100:4",
    color: "border-orange-300 bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
  },
];

export default function GivingTypesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-purple-100 text-brand-purple-600 text-sm font-bold tracking-widest uppercase mb-4">
            Ways To Give
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
            Types of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Giving
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-lg">
            There are many ways to partner with God through The Triumphant
            Family. Choose how you want to sow your seed today.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GIVING_TYPES.map((type) => (
            <div
              key={type.title}
              className={`rounded-2xl p-6 border-2 ${type.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Emoji Icon */}
              <div className="text-4xl mb-4">{type.emoji}</div>

              {/* Title */}
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {type.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {type.description}
              </p>

              {/* Scripture Badge */}
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${type.badge}`}
              >
                📖 {type.scripture}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}