// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API — PUSH SUBSCRIBE
// Saves user's push subscription to Supabase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription, userType, userId, userEmail, userAgent } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const payload = {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      user_type: userType || "guest",
      user_id: userId || null,
      user_email: userEmail || null,
      user_agent: userAgent || null,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    // Upsert — replace if endpoint already exists
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(payload, { onConflict: "endpoint" });

    if (error) {
      console.error("Push subscribe error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Push subscribe unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

// ━━━ Unsubscribe ━━━
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    await supabase
      .from("push_subscriptions")
      .update({ is_active: false })
      .eq("endpoint", endpoint);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Push unsubscribe error:", err);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}