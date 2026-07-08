// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE STREAM PLAYER — Clean (no blurs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default async function LiveStreamPlayer() {
  const supabase = await createClient();

  const { data: liveSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "is_live_streaming")
    .single();

  const { data: youtubeIdSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "youtube_live_id")
    .single();

  const { data: facebookUrlSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "facebook_live_url")
    .single();

  const isLive = liveSetting?.value === "true";
  const youtubeId = youtubeIdSetting?.value || "";
  const facebookUrl = facebookUrlSetting?.value || "";

  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">

        {/* Status Bar */}
        <div className="max-w-5xl mx-auto mb-6">
          {isLive ? (
            <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-2 border-brand-gold-400/60 shadow-lg">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-3 h-3 rounded-full bg-brand-gold-400 animate-ping" />
                <span className="relative w-3 h-3 rounded-full bg-brand-gold-400" />
              </div>
              <p className="text-white font-bold uppercase tracking-widest text-sm">
                🔴 We are LIVE right now — join us!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-lg">
              <svg className="w-5 h-5 text-brand-gold-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-white font-semibold text-sm">
                We&rsquo;re currently offline. Catch the next service below.
              </p>
            </div>
          )}
        </div>

        {/* Main Player */}
        <div className="max-w-5xl mx-auto">
          <div className="aspect-video rounded-3xl overflow-hidden bg-black border-2 border-brand-gold-400/40">
            {isLive && youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title="Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 flex items-center justify-center">

                <div className="relative z-10 text-center px-8">
                  {/* Gold icon */}
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-6">
                    <svg className="w-12 h-12 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                    </svg>
                  </div>

                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                    Stream Offline
                  </h3>
                  <p className="text-brand-purple-100 text-base md:text-lg mb-6 max-w-md mx-auto">
                    We go live during our services. Check the schedule below or
                    subscribe to our YouTube channel.
                  </p>

                  <p className="font-script text-brand-gold-400 text-xl mb-6">
                    See you at the next service.
                  </p>

                  <a
                    href="https://www.youtube.com/PastorOlayiwoleTriumphant"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                  >
                    <YoutubeIcon className="w-5 h-5" />
                    Subscribe on YouTube
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Platform Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="https://www.youtube.com/PastorOlayiwoleTriumphant"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-sm shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
            >
              <YoutubeIcon className="w-5 h-5" />
              Watch on YouTube
            </a>
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-sm shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                <FacebookIcon className="w-5 h-5" />
                Watch on Facebook
              </a>
            )}
            <a
              href="https://m.facebook.com/wole.ola.376/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 text-white font-bold text-sm hover:border-brand-gold-400 transition-all duration-300"
            >
              <FacebookIcon className="w-5 h-5" />
              Follow on Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}