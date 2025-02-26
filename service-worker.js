const CACHE_NAME = 'olibano-v1';
const urlsToCache = [
    '/files/',
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
    // Força ativação imediata
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Verifica se a requisição é para navegação
    if (event.request.mode === 'navigate') {
        event.respondWith(
            // Redireciona para o GlideApps
            Response.redirect('https://olibano.glide.page', 302)
        );
        return;
    }
    
    // Para outras requisições, verifica o cache primeiro
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
    // Garante que o service worker seja ativado em todas as abas abertas
    event.waitUntil(self.clients.claim());
});
