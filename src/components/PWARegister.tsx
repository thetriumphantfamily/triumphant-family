// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PWA REGISTER — Registers service worker + handles install prompt
// Add to root layout
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // ━━━ Register service worker ━━━
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[TFAM] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[TFAM] Service Worker registration failed:", err);
        });
    }

    // ━━━ Check if already installed ━━━
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // ━━━ Check if dismissed before ━━━
    const dismissed = localStorage.getItem("tfam_install_dismissed");
    if (dismissed) return;

    // ━━━ Capture install prompt ━━━
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 3 seconds
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // ━━━ Track when installed ━━━
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
      setInstallPrompt(null);
      console.log("[TFAM] App installed!");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("tfam_install_dismissed", "true");
  };

  // Don't show if installed or no prompt
  if (isInstalled || !showBanner || !installPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl p-4">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="flex items-start gap-3">
          {/* Logo */}
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-brand-gold-400/40">
            <img src="/android-chrome-192x192.png" alt="TFAM" className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-sm">
              Install TFAM App
            </p>
            <p className="text-brand-purple-200 text-xs font-semibold mt-0.5">
              Add to your home screen for the best experience
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="flex-1 px-3 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-xs font-black transition-all hover:scale-105"
              >
                📱 Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 rounded-full bg-brand-purple-950/60 text-white text-xs font-black border border-brand-gold-400/40 transition-all"
              >
                Later
              </button>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="w-6 h-6 rounded-full bg-brand-purple-950/60 text-white flex items-center justify-center flex-shrink-0 text-xs"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}