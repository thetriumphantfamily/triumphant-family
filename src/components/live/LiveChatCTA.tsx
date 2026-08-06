// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE CHAT CTA — White gradient + white buttons + tight spacing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";

const QUICK_ACTIONS = [
  { href: "/give",     emoji: "💝", label: "Sow a Seed / Give" },
  { href: "/sermons",  emoji: "🎬", label: "Past Sermons" },
  { href: "/events",   emoji: "📅", label: "Upcoming Events" },
  { href: "/contact",  emoji: "✉️", label: "Contact Us" },
];

export default function LiveChatCTA() {
  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-10 lg:p-12 shadow-lg">

            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

              {/* Left: Text + CTAs */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg mb-5">
                  <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                  <span className="text-white font-bold text-xs uppercase tracking-widest">
                    Engage With Us
                  </span>
                </div>

                {/* Heading — WHITE gradient */}
                <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  Watching Live?{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                    Engage!
                  </span>
                </h2>

                <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed mb-5">
                  Send your prayer request, share your testimony, or chat with
                  our team during the live service. We&rsquo;re here for you in
                  real-time!
                </p>

                {/* Tagline */}
                <p className="font-heading italic font-bold text-brand-gold-400 text-lg md:text-xl mb-6">
                  We are with you.
                </p>

                {/* CTAs — WHITE gradient */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/prayer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    🙏 Submit Prayer Request
                  </Link>
                  <a
                    href="https://wa.me/2348022620704?text=Hello%21%20I%27m%20watching%20the%20live%20service%20and%20I%27d%20like%20to%20share%20my%20prayer%20request."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    💬 WhatsApp Us Live
                  </a>
                </div>
              </div>

              {/* Right: Quick Actions card */}
              <div className="bg-gradient-to-br from-brand-purple-950 via-brand-violet-900 to-brand-purple-950 border-2 border-brand-gold-400/40 rounded-2xl p-5 relative overflow-hidden">

                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <h3 className="font-heading text-white text-lg font-bold mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {QUICK_ACTIONS.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/30 hover:border-brand-gold-400 text-white transition-all duration-200"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">{action.emoji}</span>
                        <span className="font-medium text-sm">{action.label}</span>
                      </span>
                      <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}