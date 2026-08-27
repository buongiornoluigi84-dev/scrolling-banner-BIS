// Service worker minimale per Banner Bis 3x3.
// Serve a rendere la web app installabile come vera PWA (senza questo file
// Android crea solo una scorciatoia col badge di Chrome).
// Non fa caching aggressivo: l'app deve restare sempre aggiornata all'ultima
// versione pubblicata su GitHub Pages.

const CACHE = 'bannerbis-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Rete prima: se online usa sempre la versione aggiornata,
  // se offline ripiega su quanto messo in cache.
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (e.request.method === 'GET' && res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
