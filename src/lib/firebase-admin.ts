// ───────────────────────────────────────────────────────────────
// FIREBASE ADMIN SDK — Supports BOTH:
// 1. Local dev: JSON file (firebase-admin-key.json)
// 2. Production (Vercel): Environment variables
// ───────────────────────────────────────────────────────────────

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import * as fs from "fs";
import * as path from "path";

let app: App;

function initFirebaseAdmin() {
  // Method 1: Try env variables first (Vercel/production)
  if (
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    try {
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n");
      const initialized = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey,
        }),
      });
      console.log("Firebase Admin initialized via ENV VARS ✅");
      return initialized;
    } catch (err) {
      console.warn("Env var init failed, trying JSON file...", err);
    }
  }

  // Method 2: Fall back to JSON file (local dev)
  try {
    const serviceAccountPath = path.join(process.cwd(), "firebase-admin-key.json");
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      const initialized = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase Admin initialized via JSON FILE ✅");
      return initialized;
    }
  } catch (err) {
    console.error("JSON file init failed:", err);
  }

  throw new Error(
    "Firebase Admin initialization failed. Set env vars OR provide firebase-admin-key.json"
  );
}

if (!getApps().length) {
  app = initFirebaseAdmin();
} else {
  app = getApps()[0];
}

export const adminMessaging = getMessaging(app);

// ─── Send notification to single token ───
export async function sendNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  try {
    const message = {
      token,
      notification: { title, body },
      data: data || {},
      webpush: {
        notification: {
          title,
          body,
          icon: "/images/logo/logo.png",
          badge: "/images/logo/logo.png",
        },
        fcmOptions: {
          link: data?.link || "/",
        },
      },
    };

    const response = await adminMessaging.send(message);
    console.log("Notification sent:", response);
    return { success: true, response };
  } catch (err) {
    console.error("Send notification error:", err);
    return { success: false, error: err };
  }
}

// ─── Send notification to multiple tokens ───
export async function sendNotificationToMultiple(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
) {
  try {
    if (tokens.length === 0) {
      return { success: false, error: "No tokens provided" };
    }

    const message = {
      tokens,
      notification: { title, body },
      data: data || {},
      webpush: {
        notification: {
          title,
          body,
          icon: "/images/logo/logo.png",
          badge: "/images/logo/logo.png",
        },
        fcmOptions: {
          link: data?.link || "/",
        },
      },
    };

    const response = await adminMessaging.sendEachForMulticast(message);
    console.log(`Notifications sent: ${response.successCount}/${tokens.length}`);
    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      response,
    };
  } catch (err) {
    console.error("Send multiple notifications error:", err);
    return { success: false, error: err };
  }
}

export { app };