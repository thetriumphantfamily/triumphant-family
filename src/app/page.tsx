import { SITE } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-hero p-8">
      <div className="text-center max-w-3xl mx-auto animate-fade-in">
        {/* Glowing Badge */}
        <div className="inline-block px-6 py-2 rounded-full bg-brand-gold-400/20 backdrop-blur-sm border border-brand-gold-400/40 mb-8">
          <span className="text-brand-gold-300 font-semibold tracking-wider text-sm uppercase">
            🚧 Site Under Construction
          </span>
        </div>

        {/* Ministry Name */}
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4 animate-slide-up">
          {SITE.name}
        </h1>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl font-script text-brand-gold-400 mb-6">
          {SITE.tagline}
        </p>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-brand-purple-100 mb-10 leading-relaxed">
          {SITE.description}
        </p>

        {/* Status Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-brand-lg">
          <p className="text-white font-semibold mb-2">
            ✅ Project Configuration Complete
          </p>
          <p className="text-brand-purple-200 text-sm">
            Tailwind colours, fonts, constants and folder structure ready.
            <br />
            Building the full website next...
          </p>
        </div>

        {/* Decorative Element */}
        <div className="mt-12 flex justify-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-gold-400 animate-pulse"></span>
          <span className="w-3 h-3 rounded-full bg-brand-magenta-500 animate-pulse delay-100"></span>
          <span className="w-3 h-3 rounded-full bg-brand-purple-400 animate-pulse delay-200"></span>
        </div>
      </div>
    </main>
  );
}