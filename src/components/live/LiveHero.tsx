import { Radio } from "lucide-react";

export default function LiveHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-800 to-purple-900 py-14 lg:py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 container-custom text-center">
        {/* Live Icon with pulsing rings */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-red-600 flex items-center justify-center border-2 border-white/20">
            <Radio className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold tracking-widest uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live Stream
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
          Watch{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500">
            Live
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-purple-100 mb-4 leading-relaxed">
          Join us LIVE for powerful prayer, anointed worship, and prophetic
          declarations. Wherever you are in the world — you can connect!
        </p>
        <p className="font-script text-brand-gold-400 text-2xl mb-8">
          Pray with us. Triumph with us.
        </p>

        <nav className="flex items-center justify-center gap-2 text-sm text-purple-200/60 font-medium">
          <a href="/" className="hover:text-brand-gold-400 transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-brand-gold-400">Live</span>
        </nav>
      </div>
    </section>
  );
}