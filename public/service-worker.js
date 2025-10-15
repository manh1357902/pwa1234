const CACHE_NAME = 'pwa-camera-cache-v1';
const urlsToCache = [
  '/index.html',
  '/', // optional, tùy server config
];

// Install event: cache các file tĩnh
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('Opened cache');

      // cache nội bộ
      await cache.addAll(urlsToCache);

      // cache CDN (no-cors)
      try {
        const response = await fetch('https://cdn.tailwindcss.com', { mode: 'no-cors' });
        await cache.put('https://cdn.tailwindcss.com', response);
      } catch (err) {
        console.warn('Failed to cache Tailwind CDN', err);
      }
    })()
  );

  // Activate ngay mà không chờ page reload
  self.skipWaiting();
});

// Fetch event: trả về cache trước, nếu không có thì fetch từ network
self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (err) {
        // fallback khi offline
        const fallback = await caches.match('/index.html');
        return fallback || new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});

// Activate event: xóa cache cũ
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => !cacheWhitelist.includes(name))
          .map(name => caches.delete(name))
      );
    })()
  );

  // Claim control ngay lập tức
  self.clients.claim();
});
