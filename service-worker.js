const CACHE_NAME = 'olibano-v2';
const urlsToCache = [
    '/files/',
    '/files/index.html',
    '/files/manifest.json',
    '/files/icon-192.png',
    '/files/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => caches.match('/files/index.html'))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});
