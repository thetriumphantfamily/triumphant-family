// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUSH NOTIFICATIONS HELPER
// Server-side functions to send push notifications
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";

// ━━━ Payload type ━━━
interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
}

// ━━━ Lazy load and configure web-push ━━━
async function getWebPush() {
  const webpush = (await import("web-push")).default;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
  const privateKey = process.env.VAPID_PRIVATE_KEY || "";
  const subject = process.env.VAPID_SUBJECT || "mailto:thetriumphantgrace@gmail.com";

  if (publicKey && privateKey) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
  }

  return webpush;
}

// ━━━ Send to a single subscription ━━━
async function sendToSubscription(
  subscription: {
    endpoint: string;
    p256dh: string;
    auth: string;
  },
  payload: PushPayload
): Promise<boolean> {
  try {
    const webpush = await getWebPush();

    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        url: payload.url || "/",
        icon: payload.icon || "/android-chrome-192x192.png",
        badge: payload.badge || "/android-chrome-192x192.png",
      })
    );

    return true;
  } catch (err: unknown) {
    const error = err as { statusCode?: number };
    if (error.statusCode === 410 || error.statusCode === 404) {
      try {
        const supabase = await createClient();
        await supabase
          .from("push_subscriptions")
          .update({ is_active: false })
          .eq("endpoint", subscription.endpoint);
      } catch {
        // ignore cleanup errors
      }
    }
    console.error("Push send error:", err);
    return false;
  }
}

// ━━━ SEND TO ALL SUBSCRIBERS ━━━
export async function pushToAll(payload: PushPayload): Promise<number> {
  try {
    const supabase = await createClient();
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("is_active", true);

    if (!subs || subs.length === 0) return 0;

    const results = await Promise.all(
      subs.map((sub) => sendToSubscription(sub, payload))
    );
    return results.filter(Boolean).length;
  } catch (err) {
    console.error("pushToAll error:", err);
    return 0;
  }
}

// ━━━ SEND TO ALL MEMBERS ━━━
export async function pushToMembers(payload: PushPayload): Promise<number> {
  try {
    const supabase = await createClient();
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("is_active", true)
      .eq("user_type", "member");

    if (!subs || subs.length === 0) return 0;

    const results = await Promise.all(
      subs.map((sub) => sendToSubscription(sub, payload))
    );
    return results.filter(Boolean).length;
  } catch (err) {
    console.error("pushToMembers error:", err);
    return 0;
  }
}

// ━━━ SEND TO ALL TDA STUDENTS ━━━
export async function pushToStudents(payload: PushPayload): Promise<number> {
  try {
    const supabase = await createClient();
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("is_active", true)
      .eq("user_type", "student");

    if (!subs || subs.length === 0) return 0;

    const results = await Promise.all(
      subs.map((sub) => sendToSubscription(sub, payload))
    );
    return results.filter(Boolean).length;
  } catch (err) {
    console.error("pushToStudents error:", err);
    return 0;
  }
}

// ━━━ SEND TO SPECIFIC MEMBER ━━━
export async function pushToMember(
  memberId: string,
  payload: PushPayload
): Promise<number> {
  try {
    const supabase = await createClient();
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("is_active", true)
      .eq("user_id", memberId);

    if (!subs || subs.length === 0) return 0;

    const results = await Promise.all(
      subs.map((sub) => sendToSubscription(sub, payload))
    );
    return results.filter(Boolean).length;
  } catch (err) {
    console.error("pushToMember error:", err);
    return 0;
  }
}

// ━━━ SEND TO SPECIFIC STUDENT ━━━
export async function pushToStudent(
  studentId: string,
  payload: PushPayload
): Promise<number> {
  try {
    const supabase = await createClient();
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("is_active", true)
      .eq("user_id", studentId);

    if (!subs || subs.length === 0) return 0;

    const results = await Promise.all(
      subs.map((sub) => sendToSubscription(sub, payload))
    );
    return results.filter(Boolean).length;
  } catch (err) {
    console.error("pushToStudent error:", err);
    return 0;
  }
}

// ━━━ SEND TO ADMIN ━━━
export async function pushToAdmin(payload: PushPayload): Promise<number> {
  try {
    const supabase = await createClient();
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("is_active", true)
      .eq("user_type", "admin");

    if (!subs || subs.length === 0) return 0;

    const results = await Promise.all(
      subs.map((sub) => sendToSubscription(sub, payload))
    );
    return results.filter(Boolean).length;
  } catch (err) {
    console.error("pushToAdmin error:", err);
    return 0;
  }
}