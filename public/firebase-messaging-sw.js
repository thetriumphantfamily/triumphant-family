// ───────────────────────────────────────────────────────────────
// FIREBASE MESSAGING SERVICE WORKER
// Handles background notifications when app is closed
// ───────────────────────────────────────────────────────────────

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Your Firebase config (same as .env.local — hardcoded for service worker)
firebase.initializeApp({
  apiKey: "AIzaSyD2vcw-EDRFz30-QSbaj2uRsyJZ3t9DJt8",
  authDomain: "the-triumphant-family.firebaseapp.com",
  projectId: "the-triumphant-family",
  storageBucket: "the-triumphant-family.firebasestorage.app",
  messagingSenderId: "780860491645",
  appId: "1:780860491645:web:489bb30a0b0950d2132e14",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification?.title || "The Triumphant Family";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: "/images/logo/logo.png",
    badge: "/images/logo/logo.png",
    tag: "tfam-notification",
    data: payload.data || {},
    requireInteraction: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const link = event.notification.data?.link || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url.includes(link) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(link);
      }
    })
  );
});