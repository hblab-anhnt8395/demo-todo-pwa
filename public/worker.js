// Custom Service Worker — TodoFlow PWA Phase 2
// Background Sync + Push Notifications

const CACHE_NAME = "todoflow-v2";
const OFFLINE_URL = "/offline";
const SYNC_TAG = "sync-todos";

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/", OFFLINE_URL, "/manifest.json"])
    )
  );
  self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch — Network First với Offline Fallback ───────────────────────────────
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache response hợp lệ
        if (response && response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(event.request, cloned)
          );
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(
          (cached) => cached || caches.match(OFFLINE_URL)
        )
      )
  );
});

// ─── Background Sync ──────────────────────────────────────────────────────────
self.addEventListener("sync", (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(syncTodos());
  }
});

async function syncTodos() {
  // Gửi thông báo đến tất cả client rằng sync đã hoàn thành
  const clients = await self.clients.matchAll({ type: "window" });
  clients.forEach((client) =>
    client.postMessage({ type: "SYNC_COMPLETE", timestamp: Date.now() })
  );
}

// ─── Push Notifications ───────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = { title: "TodoFlow", body: "Bạn có công việc cần hoàn thành!", icon: "/icons/icon-192x192.png" };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      vibrate: [200, 100, 200],
      data: { url: data.url || "/" },
      actions: [
        { action: "open", title: "Mở app" },
        { action: "dismiss", title: "Bỏ qua" },
      ],
    })
  );
});

// ─── Notification Click ───────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((c) => c.url.includes(url) && "focus" in c);
        if (existing) return existing.focus();
        return self.clients.openWindow(url);
      })
  );
});

// ─── Message từ App ───────────────────────────────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
