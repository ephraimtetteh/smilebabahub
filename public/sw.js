// public/sw.js
// Lightweight service worker — caches the app shell + critical assets.
// Network-first for API; cache-first for static assets.

const CACHE_VERSION = "v1";
const STATIC_CACHE = `smilebaba-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `smilebaba-runtime-${CACHE_VERSION}`;

const SHELL = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.endsWith(CACHE_VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip cross-origin requests (Cloudinary, API, etc.)
  if (url.origin !== self.location.origin) return;

  // API requests: network-first, fall back to cache
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("/smilebaba/")
  ) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => {
          // HTML navigation: show offline page
          if (request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        });
    }),
  );
});
