import Link from "next/link";

export default function PartnershipCTA() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        {/* Main CTA Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900 via-purple-800 to-purple-900 p-8 md:p-12 lg:p-16 text-center shadow-2xl">
          {/* Decorative blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-magenta-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-gold-400/10 border border-brand-gold-400/20 text-brand-gold-400 text-sm font-bold tracking-widest uppercase mb-6">
              Become A Partner
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
              Partner With{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 to-brand-gold-500">
                The Triumphant Family
              </span>
            </h2>

            {/* Description */}
            <p className="max-w-2xl mx-auto text-purple-100 text-lg leading-relaxed mb-8">
              When you give to this ministry, you are not just giving money —
              you are partnering with God to change lives, heal the sick,
              deliver the captives, and spread the gospel to the ends of the
              earth. Your seed has eternal value!
            </p>

            {/* Scripture */}
            <p className="font-script text-brand-gold-400 text-2xl md:text-3xl mb-10">
              &ldquo;He which soweth bountifully shall reap also bountifully.&rdquo;
              <span className="block text-base font-body text-purple-200/80 mt-1 not-italic">
                — 2 Corinthians 9:6
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <a
                href="https://wa.me/2348022620704?text=Hello%20Prophet%20Olayiwole%2C%20I%20would%20like%20to%20become%20a%20ministry%20partner."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-gold-400 hover:bg-brand-gold-500 text-brand-purple-900 font-bold text-lg transition-all duration-200 shadow-gold hover:shadow-gold-lg hover:scale-105"
              >
                💬 Partner Via WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg transition-all duration-200"
              >
                ✉️ Send Us A Message
              </Link>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-purple-200/80 text-sm">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a
                  href="tel:+2348022620704"
                  className="hover:text-brand-gold-400 transition-colors font-medium"
                >
                  +234 802 262 0704
                </a>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-purple-200/40" />
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <a
                  href="mailto:thetriumphantgrace@gmail.com"
                  className="hover:text-brand-gold-400 transition-colors font-medium"
                >
                  thetriumphantgrace@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* International Giving Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            🌍 For international transfers or other giving methods, please{" "}
            <Link
              href="/contact"
              className="text-brand-purple-600 font-bold hover:underline"
            >
              contact us directly
            </Link>{" "}
            and we will assist you personally.
          </p>
        </div>
      </div>
    </section>
  );
}