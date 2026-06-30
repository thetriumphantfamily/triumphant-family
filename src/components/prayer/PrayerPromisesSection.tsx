// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER PROMISES — Scripture promises about prayer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import SectionHeading from "@/components/ui/SectionHeading";

const PROMISES = [
  {
    verse:     "Matthew 21:22",
    text:      "And whatever you ask in prayer, you will receive, if you have faith.",
    highlight: "you will receive",
  },
  {
    verse:     "Jeremiah 33:3",
    text:      "Call to me and I will answer you, and will tell you great and hidden things that you have not known.",
    highlight: "I will answer you",
  },
  {
    verse:     "1 John 5:14-15",
    text:      "If we ask anything according to his will, he hears us. And if we know that he hears us in whatever we ask, we know that we have the requests that we have asked of him.",
    highlight: "he hears us",
  },
  {
    verse:     "Philippians 4:6-7",
    text:      "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.",
    highlight: "let your requests be made known",
  },
  {
    verse:     "James 5:16",
    text:      "The prayer of a righteous person has great power as it is working.",
    highlight: "great power",
  },
  {
    verse:     "Mark 11:24",
    text:      "Whatever you ask in prayer, believe that you have received it, and it will be yours.",
    highlight: "believe that you have received",
  },
];

export default function PrayerPromisesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-14">
          <SectionHeading
            badge="God's Promises"
            title={
              <>
                His Word On{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Prayer
                </span>
              </>
            }
            subtitle="The Bible is full of God's promises concerning prayer. Stand on these scriptures as we pray together."
            withDivider
          />
        </div>

        {/* Promise cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PROMISES.map((promise, i) => (
            <div
              key={i}
              className="group relative bg-gradient-to-br from-brand-purple-50 to-white rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-brand-purple-100 overflow-hidden"
            >
              {/* Bible icon watermark */}
              <svg className="absolute top-4 right-4 w-12 h-12 text-brand-purple-100 group-hover:text-brand-purple-200 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
              </svg>

              <div className="relative z-10">
                {/* Verse text */}
                <p className="text-gray-700 leading-relaxed text-base italic mb-4">
                  &ldquo;{promise.text}&rdquo;
                </p>

                {/* Verse reference */}
                <div className="flex items-center gap-2 pt-4 border-t border-brand-purple-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple-600 to-brand-purple-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z"/>
                    </svg>
                  </div>
                  <p className="text-brand-purple-700 font-bold text-sm">
                    {promise.verse}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}