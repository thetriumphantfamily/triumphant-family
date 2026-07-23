// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANNOUNCEMENT BANNER — Sitewide message controlled from admin settings
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";

// Color themes for the banner
const BANNER_STYLES: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  info: {
    bg: "bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600",
    text: "text-white",
    icon: "ℹ️",
  },
  warning: {
    bg: "bg-gradient-to-r from-brand-gold-500 via-brand-gold-400 to-brand-gold-500",
    text: "text-brand-purple-900",
    icon: "⚠️",
  },
  success: {
    bg: "bg-gradient-to-r from-green-600 via-green-500 to-green-600",
    text: "text-white",
    icon: "✅",
  },
  alert: {
    bg: "bg-gradient-to-r from-red-700 via-red-600 to-red-700",
    text: "text-white",
    icon: "🚨",
  },
};

export default async function AnnouncementBanner() {
  const supabase = await createClient();

  // Fetch banner settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["show_banner", "banner_message", "banner_color"]);

  const settingsMap: Record<string, string> = {};
  settings?.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  const showBanner = settingsMap.show_banner === "true";
  const message = settingsMap.banner_message || "";
  const color = settingsMap.banner_color || "info";

  // Don't show if disabled or empty
  if (!showBanner || !message.trim()) return null;

  const style = BANNER_STYLES[color] || BANNER_STYLES.info;

  return (
    <div
      className={`relative ${style.bg} ${style.text} py-2.5 px-4 border-b-2 border-brand-gold-400/60 shadow-md`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-center gap-3 text-center">
          <span className="text-lg flex-shrink-0 animate-pulse">
            {style.icon}
          </span>
          <p className="font-semibold text-sm md:text-base leading-tight">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

// ━━━ END OF FILE ━━━