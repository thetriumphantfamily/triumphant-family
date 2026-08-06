// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITE NOTIFICATIONS HELPER — Main website admin notifications + push
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import { pushToAdmin } from "@/lib/push-notifications";

interface SiteNotificationPayload {
  title: string;
  message: string;
  type: "contact" | "prayer" | "testimony" | "newsletter" | "visitor" | "info";
  link?: string;
}

export async function notifySiteAdmin(payload: SiteNotificationPayload) {
  try {
    const supabase = await createClient();

    // ━━━ 1. Save to DB ━━━
    await supabase.from("site_notifications").insert({
      title: payload.title,
      message: payload.message,
      type: payload.type,
      link: payload.link || null,
      is_read: false,
    });

    // ━━━ 2. Push to admin devices ━━━
    await pushToAdmin({
      title: payload.title,
      body: payload.message,
      url: payload.link || "/admin/notifications",
    });
  } catch (err) {
    console.error("Site notification error:", err);
  }
}