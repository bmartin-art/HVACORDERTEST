/* Brookstone HVAC Takeoff — service worker (offline app shell).
   Bump CACHE on each release so installed copies refresh to the new build. */
const CACHE = 'bk-takeoff-r1-7';
const ASSETS = ['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;            // let POSTs (email/AI) go straight to network
  e.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).catch(() => caches.match('index.html'))
    )
  );
});
