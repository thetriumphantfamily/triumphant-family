// ───────────────────────────────────────────────────────────────
// POST /api/push/send
// Sends push notification to selected audience
// ───────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendNotificationToMultiple } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message, target, link } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("fcm_tokens")
      .select("token")
      .eq("is_active", true);

    if (target === "members") {
      query = query.eq("user_type", "member");
    } else if (target === "students") {
      query = query.eq("user_type", "student");
    } else if (target === "anonymous") {
      query = query.eq("user_type", "anonymous");
    }

    const { data: tokens, error } = await query;

    if (error) {
      console.error("Fetch tokens error:", error);
      return NextResponse.json(
        { error: "Failed to fetch tokens" },
        { status: 500 }
      );
    }

    if (!tokens || tokens.length === 0) {
      return NextResponse.json(
        { error: "No active tokens found for this audience" },
        { status: 404 }
      );
    }

    const tokenList = tokens.map((t) => t.token);

    const result = await sendNotificationToMultiple(
      tokenList,
      title,
      message,
      { link: link || "/" }
    );

    return NextResponse.json({
      success: true,
      totalTokens: tokenList.length,
      successCount: result.successCount || 0,
      failureCount: result.failureCount || 0,
    });
  } catch (err) {
    console.error("Send push error:", err);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}