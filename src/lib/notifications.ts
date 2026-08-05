// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION HELPER — Auto-create notifications + push notifications
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/client";

interface NotifyAdminParams {
  title: string;
  message: string;
  type: string;
  link?: string;
}

interface NotifyMemberParams {
  memberId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}

interface NotifyAllMembersParams {
  title: string;
  message: string;
  type: string;
  link?: string;
}

// ━━━ Send push via API route (client-side safe) ━━━
async function sendPush(payload: {
  title: string;
  body: string;
  url?: string;
  userType?: string;
  userId?: string;
}) {
  try {
    await fetch("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Push send failed (non-critical):", err);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFY ADMIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function notifyAdmin({
  title,
  message,
  type,
  link,
}: NotifyAdminParams) {
  try {
    const supabase = createClient();

    // ━━━ 1. Save to DB ━━━
    await supabase.from("tfam_notifications").insert({
      recipient_type: "admin",
      recipient_id: null,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    });

    // ━━━ 2. Push notification to admin devices ━━━
    await sendPush({
      title,
      body: message,
      url: link || "/admin/church/dashboard",
      userType: "admin",
    });
  } catch (err) {
    console.error("notifyAdmin error:", err);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFY SPECIFIC MEMBER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function notifyMember({
  memberId,
  title,
  message,
  type,
  link,
}: NotifyMemberParams) {
  try {
    const supabase = createClient();

    // ━━━ 1. Save to DB ━━━
    await supabase.from("tfam_notifications").insert({
      recipient_type: "member",
      recipient_id: memberId,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    });

    // ━━━ 2. Push notification to this member's devices ━━━
    await sendPush({
      title,
      body: message,
      url: link || "/member/notifications",
      userType: "member",
      userId: memberId,
    });
  } catch (err) {
    console.error("notifyMember error:", err);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFY ALL MEMBERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function notifyAllMembers({
  title,
  message,
  type,
  link,
}: NotifyAllMembersParams) {
  try {
    const supabase = createClient();

    // ━━━ 1. Get all approved members ━━━
    const { data: members } = await supabase
      .from("tfam_members")
      .select("id")
      .eq("status", "approved");

    if (!members || members.length === 0) return;

    // ━━━ 2. Save to DB for all members ━━━
    const notifications = members.map((m) => ({
      recipient_type: "member",
      recipient_id: m.id,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    }));

    await supabase.from("tfam_notifications").insert(notifications);

    // ━━━ 3. Push to ALL member devices ━━━
    await sendPush({
      title,
      body: message,
      url: link || "/member/notifications",
      userType: "member",
    });
  } catch (err) {
    console.error("notifyAllMembers error:", err);
  }
}