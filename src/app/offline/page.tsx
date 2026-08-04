// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OFFLINE PAGE — Shown when user has no internet connection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 flex items-center justify-center p-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 md:p-12 shadow-2xl max-w-md w-full text-center">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/android-chrome-192x192.png"
            alt="TFAM"
            className="w-20 h-20 rounded-2xl border-2 border-brand-gold-400/40"
          />
        </div>

        {/* Icon */}
        <div className="text-6xl mb-4">📡</div>

        {/* Title */}
        <h1 className="font-heading text-2xl md:text-3xl font-black text-white mb-3">
          You&apos;re Offline
        </h1>

        {/* Message */}
        <p className="text-brand-purple-200 font-semibold mb-2">
          No internet connection detected.
        </p>
        <p className="text-brand-purple-300 text-sm font-semibold mb-8">
          Please check your connection and try again. Some content may still
          be available from your last visit.
        </p>

        {/* Scripture */}
        <div className="bg-brand-purple-950/60 rounded-2xl p-4 border border-brand-gold-400/40 mb-6">
          <p className="text-brand-gold-400 italic text-sm font-semibold">
            &ldquo;I can do all things through Christ who strengthens
            me.&rdquo;
          </p>
          <p className="text-brand-purple-300 text-xs mt-1 font-semibold">
            — Philippians 4:13
          </p>
        </div>

        {/* Retry button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
        >
          🔄 Try Again
        </button>
      </div>
    </div>
  );
}