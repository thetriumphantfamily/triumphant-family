// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARE CTA — White gradient + no top icon + tight spacing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ShareCTA() {
  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">
        <div className="max-w-4xl mx-auto">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-10 text-center">

            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10">

              {/* Badge */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                  <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
                    Your Story Matters
                  </span>
                </div>
              </div>

              {/* Heading — WHITE gradient */}
              <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Has God Done Something{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                  Amazing?
                </span>
              </h2>

              <p className="max-w-2xl mx-auto text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed mb-6">
                Every testimony builds someone else&rsquo;s faith. Your story
                of healing, breakthrough, salvation, or provision could be the
                exact encouragement another person needs today!
              </p>

              <div className="flex items-center justify-center mb-6">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
              </div>

              {/* Scripture */}
              <p className="font-heading italic font-bold text-brand-gold-400 text-lg md:text-xl leading-relaxed mb-2">
                &ldquo;And they overcame him by the blood of the Lamb, and by
                the word of their testimony.&rdquo;
              </p>
              <p className="text-brand-purple-200 text-sm font-semibold mb-6">
                — Revelation 12:11
              </p>

              {/* CTA — WHITE gradient */}
              <a
                href="#share-testimony"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-base lg:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
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