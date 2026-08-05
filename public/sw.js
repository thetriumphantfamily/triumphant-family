// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TFAM SERVICE WORKER — PWA + Push Notifications
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CACHE_NAME = "tfam-v2";
const OFFLINE_URL = "/";

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/images/logo/logo.png",
];

// ━━━ INSTALL ━━━
self.addEventListener("install", (event) => {
  console.log("[TFAM SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[TFAM SW] Some assets failed to cache:", err);
      });
    })
  );
  self.skipWaiting();
});

// ━━━ ACTIVATE ━━━
self.addEventListener("activate", (event) => {
  console.log("[TFAM SW] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ━━━ FETCH — Network first, fallback to cache ━━━
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (
    url.hostname.includes("supabase.co") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/_next/")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// ━━━ PUSH — Receive notification from server ━━━
self.addEventListener("push", (event) => {
  console.log("[TFAM SW] Push received");

  let data = {
    title: "The Triumphant Family",
    body: "You have a new notification",
    icon: "/android-chrome-192x192.png",
    badge: "/android-chrome-192x192.png",
    url: "/",
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (err) {
    console.warn("[TFAM SW] Could not parse push data:", err);
  }

  const options = {
    body: data.body,
    icon: data.icon || "/android-chrome-192x192.png",
    badge: data.badge || "/android-chrome-192x192.png",
    vibrate: [100, 50, 100],
    data: { url: data.url || "/" },
    requireInteraction: false,
    tag: "tfam-notification-" + Date.now(),
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ━━━ NOTIFICATION CLICK — Open app when tapped ━━━
self.addEventListener("notificationclick", (event) => {
  console.log("[TFAM SW] Notification clicked");
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it and navigate
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});