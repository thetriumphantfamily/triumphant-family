// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION HELPER — Auto-create notifications for events
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

/**
 * Send notification to admin
 */
export async function notifyAdmin({ title, message, type, link }: NotifyAdminParams) {
  try {
    const supabase = createClient();
    await supabase.from("tfam_notifications").insert({
      recipient_type: "admin",
      recipient_id: null,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    });
  } catch (err) {
    console.error("notifyAdmin error:", err);
  }
}

/**
 * Send notification to specific member
 */
export async function notifyMember({ memberId, title, message, type, link }: NotifyMemberParams) {
  try {
    const supabase = createClient();
    await supabase.from("tfam_notifications").insert({
      recipient_type: "member",
      recipient_id: memberId,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    });
  } catch (err) {
    console.error("notifyMember error:", err);
  }
}

/**
 * Send notification to ALL approved members
 */
export async function notifyAllMembers({ title, message, type, link }: NotifyAllMembersParams) {
  try {
    const supabase = createClient();
    const { data: members } = await supabase
      .from("tfam_members")
      .select("id")
      .eq("status", "approved");

    if (!members || members.length === 0) return;

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
  } catch (err) {
    console.error("notifyAllMembers error:", err);
  }
}