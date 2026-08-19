// ───────────────────────────────────────────────────────────────
// PUSH NOTIFICATION SETUP — Registers FCM token for logged-in members
// Auto-prompts on member dashboard load
// ───────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { requestNotificationPermission, onForegroundMessage } from "@/lib/firebase";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userId?: string;
  userType?: "member" | "student" | "admin";
}

export default function PushNotificationSetup({ userId, userType = "member" }: Props) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
    setupForegroundListener();
  }, [userId]);

  const checkNotificationStatus = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const permission = Notification.permission;

    // Already granted → try to register token silently
    if (permission === "granted") {
      await registerToken();
      return;
    }

    // Never asked before → show prompt
    if (permission === "default") {
      // Wait 5 seconds before showing (better UX)
      setTimeout(() => {
        // Check if we already dismissed recently
        const dismissed = localStorage.getItem("tfam_push_dismissed");
        if (dismissed) {
          const dismissedTime = parseInt(dismissed);
          const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
          if (daysSince < 3) return; // Don't ask again for 3 days
        }
        setShowPrompt(true);
      }, 5000);
    }
  };

  const setupForegroundListener = () => {
    onForegroundMessage((payload) => {
      const title = payload.notification?.title || "New notification";
      const body = payload.notification?.body || "";

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-brand-gold-400/40 border-2 border-brand-gold-400/40`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="w-10 h-10 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 text-xl">
                    🔔
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-black text-white">{title}</p>
                  <p className="mt-1 text-sm text-brand-purple-100">{body}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-brand-gold-400/40">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-black text-brand-gold-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 8000 }
      );
    });
  };

  const registerToken = async () => {
    if (isRegistering) return;
    setIsRegistering(true);

    try {
      const token = await requestNotificationPermission();
      if (!token) {
        setIsRegistering(false);
        return;
      }

      // Get device info
      const deviceInfo = `${navigator.platform} - ${navigator.userAgent.substring(0, 100)}`;

      // Save token to Supabase
      const supabase = createClient();
      const { error } = await supabase
        .from("fcm_tokens")
        .upsert(
          {
            token,
            user_id: userId || null,
            user_type: userId ? userType : "anonymous",
            device_info: deviceInfo,
            is_active: true,
            last_used_at: new Date().toISOString(),
          },
          { onConflict: "token" }
        );

      if (error) {
        console.error("Save token error:", error);
      } else {
        console.log("✅ FCM token saved");
      }
    } catch (err) {
      console.error("Register token error:", err);
    } finally {
      setIsRegistering(false);
      setShowPrompt(false);
    }
  };

  const handleEnable = async () => {
    await registerToken();
    toast.success("🔔 Notifications enabled!");
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("tfam_push_dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:max-w-md z-50 animate-slide-up">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/60 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 text-2xl flex-shrink-0">
              🔔
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-black text-white text-base mb-1">
                Enable Notifications
              </h3>
              <p className="text-brand-purple-200 text-sm leading-snug">
                Stay updated with prayer requests, sermons, events, and church announcements.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              disabled={isRegistering}
              className="flex-1 px-4 py-2.5 rounded-xl bg-brand-purple-950/60 text-white font-bold text-sm border border-brand-gold-400/30 hover:border-brand-gold-400 transition-all disabled:opacity-50"
            >
              Not Now
            </button>
            <button
              onClick={handleEnable}
              disabled={isRegistering}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all disabled:opacity-50"
            >
              {isRegistering ? "..." : "Enable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}