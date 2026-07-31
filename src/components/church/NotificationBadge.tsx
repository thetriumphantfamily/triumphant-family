// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION BADGE — Shared unread counter
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface NotificationBadgeProps {
  recipientType: "member" | "admin";
  recipientId?: string | null;
}

export default function NotificationBadge({
  recipientType,
  recipientId = null,
}: NotificationBadgeProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadCount();
  }, [recipientType, recipientId]);

  const loadCount = async () => {
    try {
      const supabase = createClient();

      let query = supabase
        .from("tfam_notifications")
        .select("id", { count: "exact", head: true })
        .eq("recipient_type", recipientType)
        .eq("is_read", false);

      if (recipientType === "member" && recipientId) {
        query = query.eq("recipient_id", recipientId);
      }

      if (recipientType === "admin") {
        query = query.is("recipient_id", null);
      }

      const { count } = await query;
      setCount(count || 0);
    } catch (error) {
      console.error("Notification count error:", error);
    }
  };

  if (count === 0) return null;

  return (
    <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-brand-gold-400 text-brand-purple-900 text-[11px] font-black shadow-gold">
      {count > 99 ? "99+" : count}
    </span>
  );
}