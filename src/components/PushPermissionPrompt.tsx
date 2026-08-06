// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUSH PERMISSION PROMPT — Beautiful custom prompt for notification permission
// Shows: after 20s for visitors, faster if PWA is installed
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

// ━━━ Find user session from localStorage ━━━
function getUserInfo(): { userType: string; userId: string | null; userEmail: string | null } {
  try {
    const memberSession = localStorage.getItem("tfam_member_session");
    if (memberSession) {
      const parsed = JSON.parse(memberSession);
      return {
        userType: "member",
        userId: parsed.id || null,
        userEmail: parsed.email || null,
      };
    }

    const tdaSession = localStorage.getItem("tda_student_session");
    if (tdaSession) {
      const parsed = JSON.parse(tdaSession);
      return {
        userType: "student",
        userId: parsed.id || null,
        userEmail: parsed.email || null,
      };
    }

    const churchAdmin = localStorage.getItem("church_admin_session");
    const tdaAdmin = localStorage.getItem("tda_admin_session");
    if (churchAdmin || tdaAdmin) {
      return {
        userType: "admin",
        userId: null,
        userEmail: null,
      };
    }
  } catch {
    // ignore
  }

  return { userType: "guest", userId: null, userEmail: null };
}

export default function PushPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const checkStatus = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();

        if (sub) return;

        if (Notification.permission === "denied") return;
        if (Notification.permission === "granted") {
          await subscribeUser();
          return;
        }

        const dismissed = localStorage.getItem("tfam_push_dismissed");
        if (dismissed) {
          const dismissedAt = parseInt(dismissed);
          const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
          if (daysSince < 7) return;
        }

        const isPWA = window.matchMedia("(display-mode: standalone)").matches;
        const delay = isPWA ? 2000 : 20000;

        setTimeout(() => setShowPrompt(true), delay);
      } catch (err) {
        console.warn("[Push] check status failed:", err);
      }
    };

    checkStatus();
  }, []);

  const subscribeUser = async () => {
    setSubscribing(true);
    try {
      const reg = await navigator.serviceWorker.ready;

      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setShowPrompt(false);
          return;
        }
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      const userInfo = getUserInfo();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          ...userInfo,
          userAgent: navigator.userAgent,
        }),
      });

      setShowPrompt(false);
      console.log("[TFAM] Push subscription saved");
    } catch (err) {
      console.error("[Push] subscribe failed:", err);
    } finally {
      setSubscribing(false);
    }
  };

  const handleEnable = () => {
    subscribeUser();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("tfam_push_dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[60] md:left-auto md:right-4 md:w-96 animate-slide-down">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl p-4">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-sm mb-0.5">
              🔔 Stay Connected!
            </p>
            <p className="text-brand-purple-200 text-xs font-semibold leading-relaxed">
              Get notified when Pastor posts sermons, devotionals & announcements.
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleEnable}
                disabled={subscribing}
                className="flex-1 px-3 py-2 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 text-xs font-black transition-all hover:scale-105 disabled:opacity-50"
              >
                {subscribing ? "Enabling..." : "Enable"}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 rounded-full bg-brand-purple-950/60 text-white text-xs font-black border border-brand-gold-400/40 transition-all"
              >
                Not now
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-6 h-6 rounded-full bg-brand-purple-950/60 text-white flex items-center justify-center flex-shrink-0 text-xs hover:bg-brand-purple-950"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}