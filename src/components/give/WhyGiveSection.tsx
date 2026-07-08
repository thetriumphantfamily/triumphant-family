// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WHY GIVE — Book page style scripture cards (cream + purple)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SCRIPTURES = [
  {
    verse: "Luke 6:38",
    text:  "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over.",
  },
  {
    verse: "Malachi 3:10",
    text:  "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts.",
  },
  {
    verse: "Proverbs 11:24-25",
    text:  "There is that scattereth, and yet increaseth; and there is that withholdeth more than is meet, but it tendeth to poverty.",
  },
  {
    verse: "Philippians 4:19",
    text:  "But my God shall supply all your need according to his riches in glory by Christ Jesus.",
  },
];

export default function WhyGiveSection() {
  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              God&apos;s Word
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Why{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Give?
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            Giving is an act of worship and faith. The Word of God is clear
            about the blessing that follows a generous heart.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Book page style scripture cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 max-w-4xl mx-auto">
          {SCRIPTURES.map((item) => (
            <div
              key={item.verse}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.7),0_0_30px_rgba(255,199,44,0.2)]"
              style={{
                background: "linear-gradient(135deg, #faf6ec 0%, #f5eddc 100%)",
              }}
            >
              {/* Gold top edge */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-gold-400 via-brand-gold-500 to-brand-gold-400" />

              {/* Paper texture */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, #6B1F8A 0px, #6B1F8A 1px, transparent 1px, transparent 24px)",
                }}
              />

              {/* Corner ornaments */}
              <div className="absolute top-4 left-4 w-8 h-8 opacity-40 pointer-events-none">
                <svg viewBox="0 0 32 32" className="w-full h-full text-brand-gold-500" fill="currentColor">
                  <path d="M2 2 L14 2 L14 4 L4 4 L4 14 L2 14 Z" />
                  <circle cx="8" cy="8" r="2" />
                </svg>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 opacity-40 pointer-events-none scale-x-[-1]">
                <svg viewBox="0 0 32 32" className="w-full h-full text-brand-gold-500" fill="currentColor">
                  <path d="M2 2 L14 2 L14 4 L4 4 L4 14 L2 14 Z" />
                  <circle cx="8" cy="8" r="2" />
                </svg>
              </div>

              <div className="relative z-10 p-7 pt-9 flex flex-col flex-1">

                {/* Big quote icon */}
                <div className="mb-3">
                  <svg className="w-12 h-12 text-brand-purple-900/25" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Scripture text */}
                <p
                  className="text-brand-purple-900 text-base leading-relaxed italic mb-6 flex-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  &ldquo;{item.text}&rdquo;
                </p>

                {/* Signature line + verse */}
                <div className="relative pt-4">
                  <div className="absolute top-0 left-0 right-1/3 h-px bg-gradient-to-r from-brand-purple-900/50 to-transparent" />

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-purple-700 to-brand-purple-900 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400" />
                    <span className="text-brand-gold-300 text-xs font-bold">
                      📖 {item.verse}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gold bottom edge */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-500/60 via-brand-gold-400/60 to-brand-gold-500/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}