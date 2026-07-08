// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARE CTA — Clean purple + gold theme
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ShareCTA() {
  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">
        <div className="max-w-4xl mx-auto">

          {/* Main CTA card — same gradient + gold border */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 md:p-12 lg:p-16 text-center">

            {/* Gold top bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10">

              {/* Gold icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-6">
                <svg className="w-8 h-8 text-brand-purple-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
              </div>

              {/* Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                  <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
                    Your Story Matters
                  </span>
                </div>
              </div>

              {/* Heading */}
              <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Has God Done Something{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                  Amazing?
                </span>
              </h2>

              {/* Description */}
              <p className="max-w-2xl mx-auto text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed mb-8">
                Every testimony builds someone else&rsquo;s faith. Your story
                of healing, breakthrough, salvation, or provision could be the
                exact encouragement another person needs today!
              </p>

              {/* Gold divider */}
              <div className="flex items-center justify-center mb-8">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
              </div>

              {/* Scripture */}
              <p className="font-script text-brand-gold-400 text-xl md:text-2xl leading-relaxed mb-2">
                &ldquo;And they overcame him by the blood of the Lamb, and by
                the word of their testimony.&rdquo;
              </p>
              <p className="text-brand-purple-200 text-sm font-semibold mb-10">
                — Revelation 12:11
              </p>

              {/* CTA */}
              <a
                href="#share-testimony"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base lg:text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                🎉 Share Your Testimony Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}