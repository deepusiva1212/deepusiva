// ═══════════════════════════════════════════════════════
//  DEEPU SIVA ERP — Service Worker v1
//  Caches ERP pages for offline use.
//  Offline invoices saved locally → sync when back online.
// ═══════════════════════════════════════════════════════

const CACHE_NAME  = 'ds-erp-v1';
const STATIC_URLS = [
  '/admin-erp.html',
  '/style.css',
  '/ds-firebase.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// ── INSTALL: cache all static assets ──
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_URLS.map(url => cache.add(url).catch(() => {}))
      );
    })
  );
});

// ── ACTIVATE: clean old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: serve from cache, fall back to network ──
self.addEventListener('fetch', event => {
  // Skip Firebase API calls — always need network for those
  if (event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('firebase') ||
      event.request.url.includes('googleapis.com/identitytoolkit')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful GET responses
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/admin-erp.html');
        }
      });
    })
  );
});

// ── BACKGROUND SYNC: sync offline invoices when back online ──
self.addEventListener('sync', event => {
  if (event.tag === 'sync-offline-invoices') {
    event.waitUntil(syncOfflineInvoices());
  }
});

async function syncOfflineInvoices() {
  // Signal all open clients to run their sync function
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_OFFLINE_INVOICES' });
  });
}
