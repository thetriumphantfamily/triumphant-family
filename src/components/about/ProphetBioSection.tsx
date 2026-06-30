// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROPHET BIO SECTION — Full biography of Prophet Olayiwole Ogunsola
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Image from "next/image";
import Link  from "next/link";

export default function ProphetBioSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-72 h-72 rounded-full bg-brand-gold-400/5 blur-3xl" />
        <div className="absolute bottom-[10%] left-[5%] w-72 h-72 rounded-full bg-brand-purple-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold-400/15 border border-brand-gold-400/30 mb-3">
            <span className="text-brand-gold-600 font-bold text-xs uppercase tracking-widest">
              Meet the Man of God
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-12 items-center max-w-6xl mx-auto">

          {/* ── Photo column ── */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[340px] h-[340px] md:w-[400px] md:h-[400px] rounded-full border-2 border-brand-gold-300/30 animate-pulse-slow" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full border border-brand-purple-200/40" />
              </div>

              {/* Photo */}
              <div className="relative w-[280px] h-[360px] md:w-[340px] md:h-[440px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-purple-700 to-brand-violet-900">
                <Image
                  src="/images/prophet/prophet.png"
                  alt="Prophet Olayiwole Ogunsola"
                  fill
                  className="object-cover object-top"
                  unoptimized
                />

                {/* Bottom gradient + label */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-brand-purple-900/90 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 text-center text-white">
                  <p className="font-script text-brand-gold-400 text-3xl leading-none">Prophet</p>
                  <p className="font-bold text-sm tracking-wider uppercase mt-1">Olayiwole Ogunsola</p>
                </div>
              </div>

              {/* Floating credential badge */}
              <div className="absolute -bottom-4 -right-2 md:-right-6 bg-white shadow-brand-lg rounded-2xl px-4 py-3 flex items-center gap-3 border border-brand-purple-100">
                <div className="w-10 h-10 rounded-full bg-brand-gold-400/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-gold-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Founder &amp; G.O.</p>
                  <p className="text-sm text-brand-purple-900 font-bold">The Triumphant Family</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bio column ── */}
          <div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 leading-tight mb-2">
              Prophet Olayiwole Ogunsola
            </h2>
            <p className="text-brand-gold-600 font-semibold text-lg mb-6">
              Founder &amp; General Overseer
            </p>

            <div className="space-y-4 text-gray-700 leading-relaxed text-base">

              <p>
                Prophet Olayiwole Ogunsola is a man chosen by God, raised to bring
                deliverance, healing, prophetic direction, and supernatural breakthrough
                to God&rsquo;s people in this generation.
              </p>

              <p>
                Anointed with a unique gift of prayer and prophecy, his ministry is
                marked by signs and wonders, accurate prophetic declarations, and the
                manifest presence of the Holy Spirit. Through his ministry, multitudes
                have experienced salvation, healing, deliverance from oppression, and
                divine breakthrough in their lives, families, and businesses.
              </p>

              <p>
                As the Founder and General Overseer of{" "}
                <strong className="text-brand-purple-800">
                  The Triumphant Family — The Gleam of Salvation Apostolic Ministry
                </strong>
                , Prophet Olayiwole oversees a growing global ministry through in-person
                gatherings in Akute, Ogun State, and live online broadcasts that reach
                believers in every continent.
              </p>

              <p>
                His passion is simple: to see every child of God walk in the fullness
                of their inheritance in Christ — healed, delivered, prosperous, and
                triumphant.
              </p>
            </div>

            {/* Highlights row */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-brand-purple-700">10+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Years in Ministry</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-brand-purple-700">1000s</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Lives Touched</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-brand-purple-700">Global</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Online Reach</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/sermons"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 text-white font-semibold hover:bg-brand-purple-700 transition-all duration-300 shadow-brand hover:shadow-brand-lg"
              >
                Watch His Sermons
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </Link>
              <Link
                href="/prayer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-brand-purple-200 text-brand-purple-700 font-semibold hover:bg-brand-purple-50 transition-all duration-300"
              >
                Request Prayer
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}