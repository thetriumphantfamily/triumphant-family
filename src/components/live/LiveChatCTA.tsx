import Link from "next/link";

export default function LiveChatCTA() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900 via-purple-800 to-purple-900 p-8 md:p-12 lg:p-16 shadow-2xl">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-magenta-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Text */}
              <div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-brand-gold-400/10 border border-brand-gold-400/20 text-brand-gold-400 text-sm font-bold tracking-widest uppercase mb-4">
                  Engage With Us
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
                  Watching Live?{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 to-brand-gold-500">
                    Engage!
                  </span>
                </h2>
                <p className="text-purple-100 text-lg leading-relaxed mb-6">
                  Send your prayer request, share your testimony, or chat with
                  our team during the live service. We&apos;re here for you in
                  real-time!
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/prayer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-gold-400 hover:bg-brand-gold-500 text-brand-purple-900 font-bold transition-all duration-200 shadow-gold hover:scale-105"
                  >
                    🙏 Submit Prayer Request
                  </Link>
                  <a
                    href="https://wa.me/2348022620704?text=Hello%21%20I%27m%20watching%20the%20live%20service%20and%20I%27d%20like%20to%20share%20my%20prayer%20request."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all duration-200"
                  >
                    💬 WhatsApp Us Live
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-heading font-bold text-xl mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/give"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200 group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">💝</span>
                      <span className="font-medium">Sow a Seed / Give</span>
                    </span>
                    <span className="text-brand-gold-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/sermons"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200 group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">🎬</span>
                      <span className="font-medium">Past Sermons</span>
                    </span>
                    <span className="text-brand-gold-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/events"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200 group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      <span className="font-medium">Upcoming Events</span>
                    </span>
                    <span className="text-brand-gold-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200 group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">✉️</span>
                      <span className="font-medium">Contact Us</span>
                    </span>
                    <span className="text-brand-gold-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}