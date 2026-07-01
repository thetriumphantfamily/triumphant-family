// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WHY GIVE SECTION — 4 scripture cards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SCRIPTURES = [
  {
    verse: "Luke 6:38",
    text: "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over.",
  },
  {
    verse: "Malachi 3:10",
    text: "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts.",
  },
  {
    verse: "Proverbs 11:24-25",
    text: "There is that scattereth, and yet increaseth; and there is that withholdeth more than is meet, but it tendeth to poverty.",
  },
  {
    verse: "Philippians 4:19",
    text: "But my God shall supply all your need according to his riches in glory by Christ Jesus.",
  },
];

export default function WhyGiveSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
            <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
              God&apos;s Word
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-4">
            Why{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Give?
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            Giving is an act of worship and faith. The Word of God is clear
            about the blessing that follows a generous heart.
          </p>
        </div>

        {/* Scripture cards — Purple themed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {SCRIPTURES.map((item) => (
            <div
              key={item.verse}
              className="relative rounded-2xl p-6 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 text-white shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-brand-gold-400/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Decorative blobs */}
              <div className="absolute top-[-30%] right-[-20%] w-48 h-48 rounded-full bg-brand-magenta-500/20 blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-30%] left-[-20%] w-48 h-48 rounded-full bg-brand-gold-400/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Gold icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-4">
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
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>

                {/* Scripture text */}
                <p className="text-brand-purple-100 text-base leading-relaxed italic mb-4">
                  &ldquo;{item.text}&rdquo;
                </p>

                {/* Verse badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold-400/40 bg-brand-gold-400/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400" />
                  <span className="text-brand-gold-300 text-sm font-bold">
                    {item.verse}
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