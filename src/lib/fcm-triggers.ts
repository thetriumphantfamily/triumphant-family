// ───────────────────────────────────────────────────────────────
// FCM AUTO TRIGGERS — Helper to send push notifications
// automatically when specific events happen
// ───────────────────────────────────────────────────────────────

/**
 * Send push notification via API route
 * Use this in admin actions (create sermon, event, etc.)
 */
export async function sendPushNotification({
  title,
  message,
  target = "all",
  link,
}: {
  title: string;
  message: string;
  target?: "all" | "members" | "students" | "anonymous";
  link?: string;
}) {
  try {
    // Get base URL (works locally + production)
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/push/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message, target, link: link || "/" }),
    });

    if (!response.ok) {
      console.error("Push notification failed:", await response.text());
      return { success: false };
    }

    const result = await response.json();
    console.log(`Push sent: ${result.successCount}/${result.totalTokens}`);
    return { success: true, ...result };
  } catch (err) {
    console.error("sendPushNotification error:", err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────
// PRE-BUILT TRIGGER TEMPLATES
// ─────────────────────────────────────────────────────────────

/** Notify all when new sermon uploaded */
export async function notifyNewSermon(sermonTitle: string, sermonId?: string) {
  return sendPushNotification({
    title: "🎙️ New Sermon Available!",
    message: `Watch "${sermonTitle}" now on The Triumphant Family website.`,
    target: "all",
    link: sermonId ? `/sermons/${sermonId}` : "/sermons",
  });
}

/** Notify all when new event created */
export async function notifyNewEvent(eventTitle: string, eventId?: string) {
  return sendPushNotification({
    title: "📅 New Event Announced!",
    message: `Don't miss "${eventTitle}". Check details on the website.`,
    target: "all",
    link: eventId ? `/events/${eventId}` : "/events",
  });
}

/** Notify all members when admin posts announcement */
export async function notifyNewAnnouncement(title: string, body: string) {
  return sendPushNotification({
    title: `📢 ${title}`,
    message: body.substring(0, 150) + (body.length > 150 ? "..." : ""),
    target: "members",
    link: "/member/announcements",
  });
}

/** Notify members when new devotional posted */
export async function notifyNewDevotional(devotionalTitle: string) {
  return sendPushNotification({
    title: "📕 Today's Devotional Ready!",
    message: `"${devotionalTitle}" - Read the Word for today.`,
    target: "members",
    link: "/member/devotional",
  });
}

/** Notify TDA students when new material uploaded */
export async function notifyNewTDAMaterial(materialTitle: string) {
  return sendPushNotification({
    title: "📚 New TDA Material Available!",
    message: `"${materialTitle}" is now available in your student portal.`,
    target: "students",
    link: "/bible-school/portal/materials",
  });
}

/** Notify TDA students when new assignment posted */
export async function notifyNewTDAAssignment(assignmentTitle: string, dueDate?: string) {
  const dueMsg = dueDate ? ` Due: ${dueDate}` : "";
  return sendPushNotification({
    title: "📝 New TDA Assignment!",
    message: `"${assignmentTitle}" has been assigned.${dueMsg}`,
    target: "students",
    link: "/bible-school/portal/assignments",
  });
}

/** Notify TDA students when TDA session scheduled */
export async function notifyNewTDASession(sessionTitle: string, sessionDate: string) {
  return sendPushNotification({
    title: "🎓 TDA Class Scheduled!",
    message: `"${sessionTitle}" on ${sessionDate}. Don't miss it!`,
    target: "students",
    link: "/bible-school/portal/announcements",
  });
}

/** Reminder for upcoming service */
export async function notifyServiceReminder(serviceName: string, time: string) {
  return sendPushNotification({
    title: `🙏 ${serviceName} Starts Soon!`,
    message: `Join us at ${time}. See you in service!`,
    target: "members",
    link: "/live",
  });
}

/** Live stream started */
export async function notifyLiveStreamStarted() {
  return sendPushNotification({
    title: "🔴 WE ARE LIVE NOW!",
    message: "Prophet Olayiwole is preaching now. Join us live!",
    target: "all",
    link: "/live",
  });
}

/** Notify when prayer request marked as answered */
export async function notifyPrayerAnswered(memberName: string) {
  return sendPushNotification({
    title: "🙌 Prayer Answered!",
    message: `${memberName}, your prayer request has been marked as answered. Praise God!`,
    target: "members",
    link: "/member/prayer-requests",
  });
}