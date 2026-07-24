// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE STREAM PLAYER — Dual platform (YouTube + Facebook) with orientation
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

  // Fetch all settings we need
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", [
      "is_live_streaming",
      "youtube_live_url",
      "youtube_orientation",
      "facebook_live_url",
      "facebook_orientation",
      "event_start_date",
      "pre_live_message",
      "youtube_url",
      "facebook_url",
    ]);

  // Build settings map
  const settingsMap: Record<string, string> = {};
  settings?.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  const isLive = settingsMap.is_live_streaming === "true";

  // Trim and validate URLs — must have actual content
  const youtubeLiveUrl = (settingsMap.youtube_live_url || "").trim();
  const facebookLiveUrl = (settingsMap.facebook_live_url || "").trim();

  // Only consider URL valid if it starts with https://
  const hasYoutube = youtubeLiveUrl.startsWith("https://");
  const hasFacebook = facebookLiveUrl.startsWith("https://");

  const youtubeOrientation = settingsMap.youtube_orientation || "landscape";
  const facebookOrientation = settingsMap.facebook_orientation || "landscape";
  const eventStartDate = settingsMap.event_start_date || "Sunday 8:00 AM";
  const preLiveMessage =
    settingsMap.pre_live_message ||
    "The live stream will begin at our next service.";
  const youtubeChannel =
    settingsMap.youtube_url ||
    "https://www.youtube.com/PastorOlayiwoleTriumphant";
  const facebookPage =
    settingsMap.facebook_url || "https://m.facebook.com/wole.ola.376/";

  // Aspect ratio classes
  const getAspectClass = (orientation: string) =>
    orientation === "vertical"
      ? "aspect-[9/16] max-w-sm mx-auto"
      : "aspect-video";

  // Count active streams
  const activeStreams = (hasYoutube ? 1 : 0) + (hasFacebook ? 1 : 0);
  const bothActive = hasYoutube && hasFacebook;

  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">
        {/* Status Bar */}
        <div className="max-w-5xl mx-auto mb-8">
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
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-lg mb-3">
                <svg
                  className="w-5 h-5 text-brand-gold-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-white font-semibold text-sm">
                  📅 Next Service: {eventStartDate}
                </p>
              </div>
              <p className="text-brand-purple-100 text-sm md:text-base max-w-2xl mx-auto">
                {preLiveMessage}
              </p>
            </div>
          )}
        </div>

        {/* Live streams — Only show when live AND at least one URL is valid */}
        {isLive && activeStreams > 0 ? (
          <div className="max-w-6xl mx-auto">
            {/* Section badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-bold text-xs uppercase tracking-widest">
                  {bothActive
                    ? "Watch On Any Platform"
                    : hasYoutube
                    ? "Watch On YouTube"
                    : "Watch On Facebook"}
                </span>
              </div>
            </div>

            {/* Streams grid — layout adjusts based on active streams */}
            <div
              className={`grid gap-6 ${
                bothActive ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {/* YOUTUBE LIVE — only show if URL is valid */}
              {hasYoutube && (
                <div className="relative">
                  {/* Platform label */}
                  <div className="flex items-center justify-between mb-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                        <YoutubeIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-bold">YouTube Live</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-xs font-bold uppercase">
                        Live
                      </span>
                    </div>
                  </div>

                  <div
                    className={`${getAspectClass(
                      youtubeOrientation
                    )} rounded-2xl overflow-hidden bg-black border-2 border-brand-gold-400/40`}
                  >
                    <iframe
                      src={youtubeLiveUrl}
                      title="YouTube Live Stream"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* FACEBOOK LIVE — only show if URL is valid */}
              {hasFacebook && (
                <div className="relative">
                  {/* Platform label */}
                  <div className="flex items-center justify-between mb-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                        <FacebookIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-bold">Facebook Live</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-xs font-bold uppercase">
                        Live
                      </span>
                    </div>
                  </div>

                  <div
                    className={`${getAspectClass(
                      facebookOrientation
                    )} rounded-2xl overflow-hidden bg-black border-2 border-brand-gold-400/40`}
                  >
                    <iframe
                      src={facebookLiveUrl}
                      title="Facebook Live Stream"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* OFFLINE STATE — shows when not live OR no valid URLs */
          <div className="max-w-5xl mx-auto">
            <div className="aspect-video rounded-3xl overflow-hidden bg-black border-2 border-brand-gold-400/40 relative">
              <div className="relative w-full h-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 flex items-center justify-center">
                <div className="relative z-10 text-center px-8">
                  {/* Gold icon */}
                  <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-6">
                    <svg
                      className="w-10 h-10 md:w-12 md:h-12 text-brand-purple-900"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                      />
                    </svg>
                  </div>

                  <h3 className="font-heading text-2xl md:text-4xl font-bold text-white mb-4">
                    Stream Offline
                  </h3>

                  <p className="text-brand-purple-100 text-sm md:text-lg mb-4 max-w-md mx-auto">
                    Come back for our next service and be blessed!
                  </p>

                  <p className="font-script text-brand-gold-400 text-lg md:text-xl mb-6">
                    Pray with us. Triumph with us.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={youtubeChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-sm shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                    >
                      <YoutubeIcon className="w-5 h-5" />
                      Subscribe on YouTube
                    </a>
                    <a
                      href={facebookPage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 text-white font-bold text-sm hover:border-brand-gold-400 transition-all duration-300"
                    >
                      <FacebookIcon className="w-5 h-5" />
                      Follow on Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Buttons (always visible below) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <a
            href={youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all duration-300"
          >
            <YoutubeIcon className="w-5 h-5" />
            Visit YouTube Channel
          </a>
          <a
            href={facebookPage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FacebookIcon className="w-5 h-5" />
            Visit Facebook Page
          </a>
        </div>
      </div>
    </section>
  );
}