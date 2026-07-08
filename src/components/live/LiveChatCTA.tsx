// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE CHAT CTA — Clean engage section (both CTAs gold)
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
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 md:p-12 lg:p-16 shadow-lg">

            {/* Gold top bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

              {/* Left: Text + CTAs */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg mb-6">
                  <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                  <span className="text-white font-bold text-xs uppercase tracking-widest">
                    Engage With Us
                  </span>
                </div>

                {/* Heading */}
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Watching Live?{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                    Engage!
                  </span>
                </h2>

                {/* Description */}
                <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed mb-6">
                  Send your prayer request, share your testimony, or chat with
                  our team during the live service. We&rsquo;re here for you in
                  real-time!
                </p>

                {/* Script tagline */}
                <p className="font-script text-brand-gold-400 text-xl md:text-2xl mb-8">
                  We are with you.
                </p>

                {/* CTAs — BOTH GOLD */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/prayer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                  >
                    🙏 Submit Prayer Request
                  </Link>
                  <a
                    href="https://wa.me/2348022620704?text=Hello%21%20I%27m%20watching%20the%20live%20service%20and%20I%27d%20like%20to%20share%20my%20prayer%20request."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                  >
                    💬 WhatsApp Us Live
                  </a>
                </div>
              </div>

              {/* Right: Quick Actions card */}
              <div className="bg-gradient-to-br from-brand-purple-950 via-brand-violet-900 to-brand-purple-950 border-2 border-brand-gold-400/40 rounded-2xl p-6 relative overflow-hidden">

                {/* Gold top bar */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <h3 className="font-heading text-white text-xl font-bold mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {QUICK_ACTIONS.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/30 hover:border-brand-gold-400 hover:shadow-[0_0_15px_rgba(255,199,44,0.15)] text-white transition-all duration-200"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{action.emoji}</span>
                        <span className="font-medium">{action.label}</span>
                      </span>
                      <svg className="w-5 h-5 text-brand-gold-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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