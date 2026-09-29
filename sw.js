const CACHE_NAME = 'deepusiva-public-v2';
const PUBLIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/projects.html',
  '/industries.html',
  '/contact.html',
  '/faq.html',
  '/css/main.css',
  '/js/main.js',
  '/manifest.json',
  '/assets/industrial-mark.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/og-image.svg'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PUBLIC_ASSETS).catch(() => {})));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || url.pathname.startsWith('/internal/') || event.request.method !== 'GET') return;
  if (url.pathname.endsWith('ds-firebase.js') || url.pathname.endsWith('config.js')) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const clone=response.clone(); caches.open(CACHE_NAME).then(c=>c.put(event.request,clone)); }
    return response;
  }).catch(() => caches.match('/index.html'))));
});
