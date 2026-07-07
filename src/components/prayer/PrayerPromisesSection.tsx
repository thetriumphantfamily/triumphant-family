// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER PROMISES — Scripture promises about prayer (clean, no blobs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PROMISES = [
  {
    verse: "Matthew 21:22",
    text:  "And whatever you ask in prayer, you will receive, if you have faith.",
  },
  {
    verse: "Jeremiah 33:3",
    text:  "Call to me and I will answer you, and will tell you great and hidden things that you have not known.",
  },
  {
    verse: "1 John 5:14-15",
    text:  "If we ask anything according to his will, he hears us. And if we know that he hears us in whatever we ask, we know that we have the requests that we have asked of him.",
  },
  {
    verse: "Philippians 4:6-7",
    text:  "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.",
  },
  {
    verse: "James 5:16",
    text:  "The prayer of a righteous person has great power as it is working.",
  },
  {
    verse: "Mark 11:24",
    text:  "Whatever you ask in prayer, believe that you have received it, and it will be yours.",
  },
];

export default function PrayerPromisesSection() {
  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              God&apos;s Promises
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            His Word On{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Prayer
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            The Bible is full of God&apos;s promises concerning prayer. Stand on these
            scriptures as we pray together.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Promise cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PROMISES.map((promise, i) => (
            <div
              key={i}
              className="group bg-white/10 backdrop-blur-md rounded-3xl p-6 lg:p-7 border-2 border-white/20 hover:border-brand-gold-400/60 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col"
            >
              {/* Gold top bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Bible watermark icon */}
              <svg className="absolute top-4 right-4 w-10 h-10 text-white/5 group-hover:text-white/10 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
              </svg>

              {/* Quote mark */}
              <svg className="w-8 h-8 text-brand-gold-400/40 mb-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              {/* Verse text */}
              <p className="text-brand-purple-100 leading-relaxed text-sm lg:text-base italic flex-1 mb-5 text-justify">
                &ldquo;{promise.text}&rdquo;
              </p>

              {/* Verse reference */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-brand-purple-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
                  </svg>
                </div>
                <p className="text-brand-gold-400 font-bold text-sm">
                  {promise.verse}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}