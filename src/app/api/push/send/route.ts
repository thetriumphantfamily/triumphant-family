// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API — PUSH SEND
// Sends push notifications based on target type
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { NextRequest, NextResponse } from "next/server";
import {
  pushToAll,
  pushToMembers,
  pushToStudents,
  pushToMember,
  pushToStudent,
  pushToAdmin,
} from "@/lib/push-notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, body: message, url, userType, userId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    const payload = {
      title,
      body: message,
      url: url || "/",
    };

    let sent = 0;

    // ━━━ Route to correct target ━━━
    if (userType === "admin") {
      sent = await pushToAdmin(payload);
    } else if (userType === "member" && userId) {
      sent = await pushToMember(userId, payload);
    } else if (userType === "member") {
      sent = await pushToMembers(payload);
    } else if (userType === "student" && userId) {
      sent = await pushToStudent(userId, payload);
    } else if (userType === "student") {
      sent = await pushToStudents(payload);
    } else {
      sent = await pushToAll(payload);
    }

    return NextResponse.json({ success: true, sent });
  } catch (err) {
    console.error("Push send API error:", err);
    return NextResponse.json(
      { error: "Failed to send push" },
      { status: 500 }
    );
  }
}