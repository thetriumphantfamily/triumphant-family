// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARE CTA — Encouragement to submit testimony
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ShareCTA() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA card */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 p-8 md:p-12 lg:p-16 text-center shadow-2xl">
            {/* Decorative blobs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-brand-magenta-500/20 blur-3xl" />
              <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 rounded-full bg-brand-gold-400/10 blur-3xl" />
            </div>

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-gold-400/40 bg-brand-gold-400/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-brand-gold-300 font-semibold text-sm uppercase tracking-widest">
                  Your Story Matters
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Has God Done Something{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                  Amazing?
                </span>
              </h2>

              {/* Description */}
              <p className="max-w-2xl mx-auto text-brand-purple-100 text-base md:text-lg leading-relaxed mb-8">
                Every testimony builds someone else&rsquo;s faith. Your story
                of healing, breakthrough, salvation, or provision could be the
                exact encouragement another person needs today!
              </p>

              {/* Scripture */}
              <p className="font-script text-brand-gold-400 text-xl md:text-2xl mb-2">
                &ldquo;And they overcame him by the blood of the Lamb, and by
                the word of their testimony.&rdquo;
              </p>
              <p className="text-brand-purple-200 text-sm font-semibold mb-10">
                &mdash; Revelation 12:11
              </p>

              {/* CTA */}
              <a
                href="#share-testimony"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-500 hover:to-brand-gold-600 text-brand-purple-900 font-bold text-lg transition-all duration-300 shadow-gold hover:shadow-gold-lg hover:scale-105"
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