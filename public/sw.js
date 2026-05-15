/**
 * 🏴‍☠️ HYDRA GHOST SERVICE WORKER v1.0
 * Bypasses TIB blocks by ensuring offline accessibility and dynamic asset recovery.
 */

const CACHE_NAME = 'hydra-ghost-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/_media/icons/icon-192x192.png'
];

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
