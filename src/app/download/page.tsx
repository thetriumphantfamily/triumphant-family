// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DOWNLOAD PAGE — App download page for members
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import Link from "next/link";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
      {/* Hero */}
      <div className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm mb-6">
            <Link
              href="/"
              className="text-brand-purple-200 hover:text-white font-semibold transition-colors"
            >
              Home
            </Link>
            <span className="text-brand-purple-300 font-semibold">&gt;</span>
            <span className="text-brand-gold-400 font-semibold">
              Download App
            </span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-semibold text-xs uppercase tracking-widest">
              Official App
            </span>
          </div>

          {/* Real ministry logo — slightly bigger, tighter gap */}
          <div className="flex justify-center mb-3">
            <img
              src="/images/logo/logo.png"
              alt="TFAM App"
              className="w-28 h-28 object-contain"
            />
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            The Triumphant Family
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Ministry App
            </span>
          </h1>

          <p className="text-brand-purple-200 font-semibold text-lg mb-2">
            Pray With Us. Triumph With Us.
          </p>
          <p className="text-brand-purple-300 font-semibold text-sm max-w-xl mx-auto mb-10">
            Stay connected to your church family. Watch live services, submit
            prayer requests, give online, access devotionals, and more — all in
            one app.
          </p>

          {/* Download Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
            {/* Android APK */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-black text-white text-lg mb-1">
                Android App
              </h3>
              <p className="text-brand-purple-200 font-semibold text-sm mb-4">
                Download APK directly to your Android phone
              </p>
              <a
                href="#coming-soon"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C3.6337 10.1812 2.0998 12.2003 2.0998 14.5716v.6936h19.8v-.6936c0-2.3713-1.534-4.3904-3.9723-5.8502" />
                </svg>
                Download APK
              </a>
              <p className="text-brand-purple-300 text-xs mt-2 font-semibold">
                Version 1.0.0 • Coming Soon
              </p>
            </div>

            {/* iOS PWA */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-4xl mb-3">🍎</div>
              <h3 className="font-black text-white text-lg mb-1">
                iPhone / iPad
              </h3>
              <p className="text-brand-purple-200 font-semibold text-sm mb-4">
                Install directly from your Safari browser
              </p>
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-brand-purple-900 font-black hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Install on iPhone
              </Link>
              <p className="text-brand-purple-300 text-xs mt-2 font-semibold">
                Free • No App Store needed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Install Instructions */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-xl mb-6">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h2 className="font-heading font-black text-white text-xl mb-6">
            🍎 How to Install on iPhone (iOS)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                icon: "🌐",
                title: "Open in Safari",
                desc: "Visit this website using Safari browser on your iPhone",
              },
              {
                step: "2",
                icon: "📤",
                title: "Tap Share",
                desc: 'Tap the Share button at the bottom of Safari (the box with an arrow pointing up)',
              },
              {
                step: "3",
                icon: "📱",
                title: "Add to Home Screen",
                desc: 'Scroll down and tap "Add to Home Screen" then tap "Add"',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-brand-purple-950/60 rounded-2xl p-4 border border-brand-gold-400/40 text-center"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-black text-white text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-brand-purple-200 text-xs font-semibold">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Android Install Instructions */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-xl mb-6">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h2 className="font-heading font-black text-white text-xl mb-6">
            🤖 How to Install APK on Android
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                icon: "⬇️",
                title: "Download APK",
                desc: "Tap the Download APK button above",
              },
              {
                step: "2",
                icon: "⚙️",
                title: "Allow Unknown Sources",
                desc: 'Go to Settings → Security → Enable "Unknown Sources"',
              },
              {
                step: "3",
                icon: "📂",
                title: "Open APK File",
                desc: "Find the downloaded APK in your Downloads folder and tap it",
              },
              {
                step: "4",
                icon: "✅",
                title: "Install & Open",
                desc: "Tap Install, wait for it to complete, then tap Open",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-brand-purple-950/60 rounded-2xl p-4 border border-brand-gold-400/40 text-center"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-black text-white text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-brand-purple-200 text-xs font-semibold">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h2 className="font-heading font-black text-white text-xl mb-6">
            ✨ What You Get
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { emoji: "📺", label: "Watch Live" },
              { emoji: "🙏", label: "Prayer Wall" },
              { emoji: "💰", label: "Give Online" },
              { emoji: "📖", label: "Daily Devotional" },
              { emoji: "💬", label: "Church Chat" },
              { emoji: "👥", label: "Small Groups" },
              { emoji: "📢", label: "Announcements" },
              { emoji: "🎓", label: "Bible School" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="bg-brand-purple-950/60 rounded-2xl p-3 border border-brand-gold-400/40 text-center"
              >
                <div className="text-2xl mb-1">{feature.emoji}</div>
                <p className="text-white font-black text-xs">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}