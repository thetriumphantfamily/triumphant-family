// ───────────────────────────────────────────────────────────────
// FIREBASE CLIENT CONFIG — For browser-side Firebase
// Used for: Cloud Messaging (push notifications)
// ───────────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

// ─── Firebase Config from .env.local ───
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ─── Initialize Firebase (only once) ───
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ─── Get Messaging instance (browser only) ───
let messaging: Messaging | null = null;

if (typeof window !== "undefined") {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.error("Firebase messaging init error:", err);
  }
}

// ─── Request Permission + Get FCM Token ───
export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === "undefined" || !messaging) return null;

  try {
    // Request browser permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("No registration token available");
      return null;
    }
  } catch (err) {
    console.error("Notification permission error:", err);
    return null;
  }
}

// ─── Listen for Foreground Messages ───
export function onForegroundMessage(callback: (payload: any) => void) {
  if (typeof window === "undefined" || !messaging) return;

  return onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload);
  });
}

export { app, messaging };