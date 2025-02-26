const CACHE_NAME = 'olibano-v2';
const urlsToCache = [
    '/files/',
    '/files/index.html',
    '/files/manifest.json',
    '/files/icon-192.png',
    '/files/icon-512.png',
    '/files/install.html'
];

self.addEventListener('install', event => {
    console.log('Service Worker instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    console.log('Fetch interceptado:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => caches.match('/files/index.html'))
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker ativando...');
    event.waitUntil(self.clients.claim());
});
