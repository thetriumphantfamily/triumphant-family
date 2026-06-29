import { SITE, HERO } from "@/lib/constants";

export default function HomePage() {
  return (
    <main>
      {/* ━━━ HERO SECTION ━━━ */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-magenta-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-brand-gold-400/20 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10 text-center py-20">
          <div className="inline-block px-6 py-2 rounded-full bg-brand-gold-400/20 backdrop-blur-sm border border-brand-gold-400/40 mb-8 animate-fade-in">
            <span className="text-brand-gold-300 font-semibold tracking-wider text-sm uppercase">
              {HERO.badge}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 animate-slide-up">
            Experience the{" "}
            <span className="text-gradient bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-magenta-400 bg-clip-text text-transparent">
              Supernatural
            </span>
          </h1>

          <p className="text-3xl md:text-4xl font-script text-brand-gold-400 mb-8 animate-slide-up">
            {SITE.tagline}
          </p>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-brand-purple-100 leading-relaxed mb-10 animate-slide-up">
            {HERO.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <a href="/prayer" className="btn-gold">
              🙏 Submit Prayer Request
            </a>
            <a href="/live" className="btn-outline !text-white !border-white hover:!bg-white hover:!text-brand-purple-900">
              📺 Watch Live
            </a>
          </div>
        </div>
      </section>

      {/* ━━━ WELCOME SECTION ━━━ */}
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h2 className="section-heading mb-4">Welcome to {SITE.name}</h2>
          <p className="section-subheading mb-8">
            We are a global prayer ministry under the apostolic leadership of{" "}
            <span className="text-brand-purple-600 font-semibold">
              {SITE.prophet.fullName}
            </span>
            . Join us as we encounter the supernatural and walk in unstoppable victory.
          </p>
        </div>
      </section>
    </main>
  );
}