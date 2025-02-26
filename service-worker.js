const CACHE_NAME = 'olibano-v2';
const urlsToCache = [
    '/files/',
    '/files/index.html',
    '/files/manifest.json',
    '/files/icon-192.png',
    '/files/icon-512.png',
    '/files/maskable-icon-192.png',
    '/files/maskable-icon-512.png'
];

// Intercepta a instalação do service worker
self.addEventListener('install', event => {
    console.log('Service Worker instalando...');
    // Força o service worker a se tornar ativo pulando o estado de espera
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercepta as requisições de rede
self.addEventListener('fetch', event => {
    console.log('Service Worker interceptando fetch para:', event.request.url);
    
    // Verifica se é uma navegação para o PWA
    if (event.request.mode === 'navigate') {
        console.log('Requisição de navegação interceptada, redirecionando...');
        
        // Se a URL não for a página do Glide, redireciona
        if (!event.request.url.includes('olibano.glide.page')) {
            event.respondWith(
                // Retorna uma resposta de redirecionamento
                Response.redirect('https://olibano.glide.page', 302)
            );
            return;
        }
    }
    
    // Para recursos estáticos, verifica o cache primeiro
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Retorna o recurso do cache se estiver lá
                }
                return fetch(event.request); // Senão, busca da rede
            })
    );
});

// Intercepta a ativação do service worker
self.addEventListener('activate', event => {
    console.log('Service Worker ativando...');
    
    // Toma controle de todas as páginas imediatamente
    event.waitUntil(self.clients.claim());
    
    // Limpa os caches antigos
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: removendo cache antigo', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Ativa o service worker quando recebe mensagem
self.addEventListener('message', event => {
    if (event.data === 'FORCE_ACTIVATE') {
        console.log('Service Worker: ativação forçada via mensagem');
        self.skipWaiting();
    }
});
