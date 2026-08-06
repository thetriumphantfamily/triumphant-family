// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PARTNERSHIP CTA — White gradient + white buttons + no top icon
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";

export default function PartnershipCTA() {
  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">
        <div className="max-w-5xl mx-auto">

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-10 lg:p-12 text-center">

            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10">

              {/* Badge */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                  <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
                    Become A Partner
                  </span>
                </div>
              </div>

              {/* Heading — WHITE gradient */}
              <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Partner With{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                  The Triumphant Family
                </span>
              </h2>

              <p className="max-w-2xl mx-auto text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed mb-6">
                When you give to this ministry, you are not just giving money
                — you are partnering with God to change lives, heal the
                sick, deliver the captives, and spread the gospel to the ends
                of the earth. Your seed has eternal value!
              </p>

              <div className="flex items-center justify-center mb-6">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
              </div>

              {/* Scripture */}
              <p className="font-heading italic font-bold text-brand-gold-400 text-lg md:text-xl leading-relaxed mb-2">
                &ldquo;He which soweth bountifully shall reap also bountifully.&rdquo;
              </p>
              <p className="text-brand-purple-200 text-sm font-semibold mb-6">
                — 2 Corinthians 9:6
              </p>

              {/* CTAs — WHITE gradient */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
                <a
                  href="https://wa.me/2348022620704?text=Hello%20Prophet%20Olayiwole%2C%20I%20would%20like%20to%20become%20a%20ministry%20partner."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-base lg:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  💬 Partner Via WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold text-base lg:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  ✉️ Send Us A Message
                </Link>
              </div>

              {/* Contact info */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-brand-purple-200 text-sm">
                <a
                  href="tel:+2348022620704"
                  className="flex items-center gap-2 hover:text-white transition-colors font-medium"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  +234 802 262 0704
                </a>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-white" />
                <a
                  href="mailto:thetriumphantgrace@gmail.com"
                  className="flex items-center gap-2 hover:text-white transition-colors font-medium"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  thetriumphantgrace@gmail.com
                </a>
              </div>
            </div>
          </div>

          <p className="text-center mt-6 text-brand-purple-200 text-sm">
            🌍 For international transfers or other giving methods, please{" "}
            <Link
              href="/contact"
              className="text-white font-bold hover:text-brand-gold-300 hover:underline transition-colors"
            >
              contact us directly
            </Link>{" "}
            and we will assist you personally.
          </p>

          <p className="text-center mt-4 font-heading italic font-bold text-brand-gold-400 text-lg md:text-xl">
            Sow generously. Reap abundantly.
          </p>
        </div>
      </div>
    </section>
  );
}