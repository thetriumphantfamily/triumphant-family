// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA CALL TO ACTION — White gradient + white buttons + tight spacing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";

export default function TDACallToAction() {
  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">
        <div className="max-w-5xl mx-auto">

          <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 md:p-10 lg:p-12 border-2 border-brand-gold-400/40 shadow-2xl overflow-hidden text-center">

            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            {/* Badge */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-bold text-xs uppercase tracking-widest">
                  Ready to Begin?
                </span>
              </div>
            </div>

            {/* Heading — WHITE gradient */}
            <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Discipleship
              </span>{" "}
              Journey Awaits
            </h2>

            <p className="text-brand-purple-100 text-base md:text-lg leading-relaxed mb-5 max-w-2xl mx-auto">
              Join hundreds of believers being trained, equipped, and released
              for effective ministry. Your Kingdom assignment begins here.
            </p>

            {/* Scripture */}
            <p className="font-heading italic font-bold text-brand-gold-400 text-xl md:text-2xl mb-2">
              &ldquo;Come, follow me...&rdquo;
            </p>
            <p className="text-brand-purple-200 text-sm font-semibold mb-6">
              — Matthew 4:19
            </p>

            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>

            {/* CTAs — WHITE gradient */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4">
              <Link
                href="/bible-school/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 lg:px-10 lg:py-4 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-base lg:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                Register Now
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href="/bible-school/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 lg:px-10 lg:py-4 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-bold text-base lg:text-lg hover:border-brand-gold-400 transition-all duration-300"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Existing Student Login
              </Link>
            </div>

            <p className="text-brand-purple-200 text-sm mt-6">
              Need help? Contact us at{" "}
              <a
                href="mailto:thetriumphantgrace@gmail.com"
                className="text-white font-semibold hover:underline"
              >
                thetriumphantgrace@gmail.com
              </a>
            </p>

          </div>

        </div>
      </div>
    </section>
  );
}