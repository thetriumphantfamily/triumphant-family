import { BookOpen } from "lucide-react";

const SCRIPTURES = [
  {
    verse: "Luke 6:38",
    text: "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over.",
    color: "from-violet-600 to-purple-700",
  },
  {
    verse: "Malachi 3:10",
    text: "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts.",
    color: "from-brand-gold-400 to-brand-gold-600",
  },
  {
    verse: "Proverbs 11:24-25",
    text: "There is that scattereth, and yet increaseth; and there is that withholdeth more than is meet, but it tendeth to poverty.",
    color: "from-brand-magenta-500 to-purple-600",
  },
  {
    verse: "Philippians 4:19",
    text: "But my God shall supply all your need according to his riches in glory by Christ Jesus.",
    color: "from-blue-600 to-violet-700",
  },
];

export default function WhyGiveSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-purple-100 text-brand-purple-600 text-sm font-bold tracking-widest uppercase mb-4">
            God&apos;s Word
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
            Why{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Give?
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-lg">
            Giving is an act of worship and faith. The Word of God is clear
            about the blessing that follows a generous heart.
          </p>
        </div>

        {/* Scripture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {SCRIPTURES.map((item) => (
            <div
              key={item.verse}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} mb-4 shadow-md`}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>

              {/* Text */}
              <p className="text-gray-600 text-base leading-relaxed italic mb-4">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Verse */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple-50 border border-brand-purple-100">
                <span className="text-brand-purple-600 text-sm font-bold">
                  {item.verse}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}