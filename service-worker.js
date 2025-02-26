const CACHE_NAME = 'olibano-v1';
const urlsToCache = [
    '/',
    '/files',
    '/files/index.html',
    '/files/manifest.json',
    '/files/icon-192.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Se a requisição for para navegação, redireciona para o GlideApps
    if (event.request.mode === 'navigate') {
        event.respondWith(Response.redirect('https://olibano.glide.page'));
        return;
    }

    // Caso contrário, tenta servir do cache ou faz um fetch normal
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
