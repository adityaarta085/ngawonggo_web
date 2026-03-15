// Service Worker for Desa Ngawonggo
// Strategy: Network Only (No Caching)
// This ensures the website is always up-to-date from the server.

const CACHE_NAME = 'ngawonggo-no-cache-v1';

// Install Event - Skip waiting to activate immediately
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activate Event - Clear all old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event - Network Only
self.addEventListener('fetch', event => {
  // We don't cache anything, just fetch from network
  event.respondWith(fetch(event.request));
});
