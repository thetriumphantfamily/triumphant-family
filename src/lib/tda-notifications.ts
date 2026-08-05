// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA NOTIFICATION HELPERS — Send notifications + push to TDA students + admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/client";

interface TDANotifyParams {
  title: string;
  message: string;
  type?: string;
  link?: string;
}

interface TDANotifyStudentParams extends TDANotifyParams {
  studentId: string;
}

// ━━━ Send push via API (client-side safe) ━━━
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
// NOTIFY SPECIFIC STUDENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function notifyTDAStudent({
  studentId,
  title,
  message,
  type = "general",
  link,
}: TDANotifyStudentParams): Promise<void> {
  try {
    const supabase = createClient();

    // ━━━ 1. Save to DB ━━━
    await supabase.from("tda_notifications").insert({
      recipient_type: "student",
      recipient_id: studentId,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    });

    // ━━━ 2. Push to student devices ━━━
    await sendPush({
      title,
      body: message,
      url: link || "/bible-school/portal/notifications",
      userType: "student",
      userId: studentId,
    });
  } catch (err) {
    console.error("TDA notify student error:", err);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFY ALL APPROVED STUDENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function notifyAllTDAStudents({
  title,
  message,
  type = "general",
  link,
}: TDANotifyParams): Promise<void> {
  try {
    const supabase = createClient();
    const { data: students } = await supabase
      .from("tda_students")
      .select("id")
      .eq("status", "approved");

    if (!students || students.length === 0) return;

    // ━━━ 1. Save to DB for all ━━━
    const notifications = students.map((s) => ({
      recipient_type: "student",
      recipient_id: s.id,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    }));

    await supabase.from("tda_notifications").insert(notifications);

    // ━━━ 2. Push to ALL student devices ━━━
    await sendPush({
      title,
      body: message,
      url: link || "/bible-school/portal/notifications",
      userType: "student",
    });
  } catch (err) {
    console.error("TDA notify all students error:", err);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFY TDA ADMIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function notifyTDAAdmin({
  title,
  message,
  type = "general",
  link,
}: TDANotifyParams): Promise<void> {
  try {
    const supabase = createClient();

    // ━━━ 1. Save to DB ━━━
    await supabase.from("tda_notifications").insert({
      recipient_type: "admin",
      recipient_id: null,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    });

    // ━━━ 2. Push to admin devices ━━━
    await sendPush({
      title,
      body: message,
      url: link || "/admin/bible-school/notifications",
      userType: "admin",
    });
  } catch (err) {
    console.error("TDA notify admin error:", err);
  }
}

// ━━━ Get unread count for a student ━━━
export async function getTDAUnreadCount(studentId: string): Promise<number> {
  try {
    const supabase = createClient();
    const { count } = await supabase
      .from("tda_notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", studentId)
      .eq("is_read", false);
    return count || 0;
  } catch {
    return 0;
  }
}

// ━━━ Get unread count for admin ━━━
export async function getTDAAdminUnreadCount(): Promise<number> {
  try {
    const supabase = createClient();
    const { count } = await supabase
      .from("tda_notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_type", "admin")
      .eq("is_read", false);
    return count || 0;
  } catch {
    return 0;
  }
}