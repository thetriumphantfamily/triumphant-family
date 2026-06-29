// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WELCOME SECTION — Prophet welcome message + photo placeholder
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";

export default function WelcomeSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Photo ── */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            {/* Decorative ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border-2 border-brand-gold-300/30 animate-pulse-slow" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full border border-brand-purple-200/40" />
            </div>

            {/* Photo container */}
            <div className="relative w-[260px] h-[320px] md:w-[340px] md:h-[420px] rounded-3xl overflow-hidden shadow-brand-lg bg-gradient-to-br from-brand-purple-100 to-brand-purple-200 flex items-end justify-center">
              {/* Placeholder until prophet photo is added */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-purple-400 p-6 text-center">
                <svg className="w-20 h-20 mb-4 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
                <p className="text-sm font-medium opacity-60">Prophet Olayiwole Ogunsola</p>
                <p className="text-xs opacity-40 mt-1">Photo coming soon</p>
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-brand-purple-900/60 to-transparent" />
              <p className="relative z-10 text-white text-sm font-bold pb-4 text-center px-4">
                Prophet Olayiwole Ogunsola
              </p>
            </div>

            {/* Floating badge */}
            <div className="absolute bottom-6 -right-2 md:right-4 bg-white shadow-brand rounded-2xl px-4 py-3 flex items-center gap-3 border border-brand-purple-100">
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

          {/* ── Right: Message ── */}
          <div className="order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold-400/15 border border-brand-gold-400/30 mb-5">
              <span className="text-brand-gold-600 font-bold text-xs uppercase tracking-widest">
                A Word from the Man of God
              </span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 leading-tight mb-6">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                The Triumphant Family
              </span>
            </h2>

            <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed mb-8">
              <p>
                &ldquo;You were not created to be defeated. You were created to
                triumph! God has called us together as a family — a family of
                prayer warriors, worshippers, and believers who refuse to accept
                anything less than God&rsquo;s best.&rdquo;
              </p>
              <p>
                At The Triumphant Family, we believe in the supernatural power of
                prayer, the life-changing Word of God, and the unstoppable move of
                the Holy Spirit. Every service, every prayer session, every
                encounter is designed to connect you with Heaven.
              </p>
              <p className="font-semibold text-brand-purple-800">
                You belong here. You are family.
              </p>
            </div>

            {/* Signature */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-brand-purple-100 flex items-center justify-center">
                <span className="font-heading font-bold text-brand-purple-700 text-lg">OO</span>
              </div>
              <div>
                <p className="font-bold text-brand-purple-900">Prophet Olayiwole Ogunsola</p>
                <p className="text-sm text-gray-500">Founder &amp; General Overseer</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 text-white font-semibold hover:bg-brand-purple-700 transition-all duration-300 shadow-brand hover:shadow-brand-lg"
              >
                Learn About Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/prayer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-brand-purple-200 text-brand-purple-700 font-semibold hover:bg-brand-purple-50 transition-all duration-300"
              >
                Send a Prayer Request
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}