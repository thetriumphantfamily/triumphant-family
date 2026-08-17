// ───────────────────────────────────────────────────────────────
// CAPACITOR CONFIG — The Triumphant Family Ministry App
// Brand purple: #260832 (matches dashboard gradient)
// ───────────────────────────────────────────────────────────────

import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.triumphantfamily.app",
  appName: "The Triumphant Family",
  webDir: "out",
  backgroundColor: "#260832",
  server: {
    url: "https://triumphantfamily.vercel.app/member/login",
    cleartext: true,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: "#260832",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#260832",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;