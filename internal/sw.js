const CACHE_NAME = 'deepusiva-internal-v1';
const STATIC_URLS = [
  '/internal/admin-erp.html',
  '/internal/style.css',
  '/internal/ds-firebase.js',
  '/internal/manifest.json'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(STATIC_URLS.map(url => cache.add(url).catch(() => {})))));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || !url.pathname.startsWith('/internal/') || event.request.method !== 'GET') return;
  if (url.pathname.includes('ds-firebase.js') || url.pathname.includes('config.js') || url.hostname.includes('googleapis.com')) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) { const clone=response.clone(); caches.open(CACHE_NAME).then(c=>c.put(event.request,clone)); }
    return response;
  }).catch(() => caches.match('/internal/admin-erp.html'))));
});
self.addEventListener('sync', event => {
  if (event.tag === 'sync-offline-invoices') event.waitUntil(notifyClients());
});
async function notifyClients(){ const clients=await self.clients.matchAll(); clients.forEach(client=>client.postMessage({type:'SYNC_OFFLINE_INVOICES'})); }
