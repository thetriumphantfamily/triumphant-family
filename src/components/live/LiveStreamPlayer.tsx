import { createClient } from "@/lib/supabase/server";
import { AlertCircle, Radio } from "lucide-react";

// Inline YouTube SVG icon
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// Inline Facebook SVG icon
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
    <section className="py-12 lg:py-16 bg-gray-900">
      <div className="container-custom">
        {/* Status Bar */}
        <div className="max-w-5xl mx-auto mb-6">
          {isLive ? (
            <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-red-600/20 border border-red-500/40">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="relative w-3 h-3 rounded-full bg-red-500" />
              </div>
              <p className="text-red-400 font-bold uppercase tracking-widest text-sm">
                🔴 We are LIVE right now — join us!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-gray-800/60 border border-gray-700">
              <AlertCircle className="w-5 h-5 text-brand-gold-400" />
              <p className="text-gray-300 font-medium text-sm">
                We&apos;re currently offline. Catch the next service or watch
                past sermons below.
              </p>
            </div>
          )}
        </div>

        {/* Main Player */}
        <div className="max-w-5xl mx-auto">
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-gray-800">
            {isLive && youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title="Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-violet-900 via-purple-800 to-purple-900 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                    <Radio className="w-12 h-12 text-brand-gold-400" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                    Stream Offline
                  </h3>
                  <p className="text-purple-100 text-lg mb-6 max-w-md mx-auto">
                    We go live during our services. Check the schedule below or
                    subscribe to our YouTube channel.
                  </p>
                  <a
                    href="https://www.youtube.com/PastorOlayiwoleTriumphant"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-200 shadow-lg hover:scale-105"
                  >
                    <YoutubeIcon className="w-5 h-5" />
                    Subscribe on YouTube
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Platform Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="https://www.youtube.com/PastorOlayiwoleTriumphant"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-all duration-200"
            >
              <YoutubeIcon className="w-5 h-5" />
              Watch on YouTube
            </a>
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all duration-200"
              >
                <FacebookIcon className="w-5 h-5" />
                Watch on Facebook
              </a>
            )}
            <a
              href="https://m.facebook.com/wole.ola.376/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all duration-200"
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