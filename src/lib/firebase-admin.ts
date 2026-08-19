// ───────────────────────────────────────────────────────────────
// FIREBASE ADMIN SDK — Better handling for Vercel env vars
// ───────────────────────────────────────────────────────────────

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import * as fs from "fs";
import * as path from "path";

let app: App;

function parsePrivateKey(key: string): string {
  // Remove wrapping quotes if present
  let cleaned = key.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  // Replace escaped newlines with real newlines
  cleaned = cleaned.replace(/\\n/g, "\n");
  return cleaned;
}

function initFirebaseAdmin() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  // Method 1: Try env variables (Vercel/production)
  if (projectId && clientEmail && rawPrivateKey) {
    try {
      const privateKey = parsePrivateKey(rawPrivateKey);
      const initialized = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("Firebase Admin initialized via ENV VARS ✅");
      return initialized;
    } catch (err) {
      console.warn("Env var init failed:", err);
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

// Lazy initialization to prevent build-time errors
function getApp(): App {
  if (!app) {
    if (!getApps().length) {
      app = initFirebaseAdmin();
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

// Export messaging as function to defer init
export function getAdminMessaging() {
  return getMessaging(getApp());
}

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

    const response = await getAdminMessaging().send(message);
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

    const response = await getAdminMessaging().sendEachForMulticast(message);
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