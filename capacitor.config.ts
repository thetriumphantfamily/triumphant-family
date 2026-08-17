// ───────────────────────────────────────────────────────────────
// CAPACITOR CONFIG — The Triumphant Family Ministry App
// ───────────────────────────────────────────────────────────────

import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.triumphantfamily.app",
  appName: "The Triumphant Family",
  webDir: "out",
  backgroundColor: "#3B0764",
  server: {
    url: "https://triumphantfamily.vercel.app",
    cleartext: true,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: "#3B0764",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#3B0764",
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