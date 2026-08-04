// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITE NOTIFICATIONS HELPER — Main website admin notifications
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";

interface SiteNotificationPayload {
  title: string;
  message: string;
  type: "contact" | "prayer" | "testimony" | "newsletter" | "visitor" | "info";
  link?: string;
}

export async function notifySiteAdmin(payload: SiteNotificationPayload) {
  try {
    const supabase = await createClient();
    await supabase.from("site_notifications").insert({
      title: payload.title,
      message: payload.message,
      type: payload.type,
      link: payload.link || null,
      is_read: false,
    });
  } catch (err) {
    console.error("Site notification error:", err);
  }
}