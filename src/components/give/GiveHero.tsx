import { Heart } from "lucide-react";

export default function GiveHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-800 to-purple-900 py-16 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-magenta-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 container-custom text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
          <Heart className="w-10 h-10 text-brand-gold-400 fill-brand-gold-400" />
        </div>

        {/* Badge */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-gold-400/10 border border-brand-gold-400/20 text-brand-gold-400 text-sm font-bold tracking-widest uppercase mb-4">
          Partner With Us
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
          Give{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500">
            Generously
          </span>
        </h1>

        {/* Scripture */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-purple-100 mb-4 leading-relaxed">
          &ldquo;Every man according as he purposeth in his heart, so let him
          give; not grudgingly, or of necessity: for God loveth a cheerful
          giver.&rdquo;
        </p>
        <p className="font-script text-brand-gold-400 text-2xl mb-8">
          — 2 Corinthians 9:7
        </p>

        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-sm text-purple-200/60 font-medium">
          <a href="/" className="hover:text-brand-gold-400 transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-brand-gold-400">Give</span>
        </nav>
      </div>
    </section>
  );
}