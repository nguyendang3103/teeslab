const CACHE_NAME = 'tees-lab-shell-v18';
const APP_FILES = [
  './index.html', './manifest.json', './logo.jpg', './version.json',
  './assets/samples/golden-hour.jpg',
  './assets/samples/neon-street.jpg',
  './assets/samples/forest.jpg',
  './assets/samples/portrait.jpg',
  './assets/samples/coffee.jpg',
  './assets/samples/ocean.jpg',
  './assets/fonts/Caveat-TeeLab.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache =>
    Promise.all(APP_FILES.map(url => cache.add(new Request(url, { cache: 'no-cache' }))))
  ).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith('tees-lab-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(new Request(request, { cache: 'no-cache' })).then(async response => {
      if (response.ok) await caches.open(CACHE_NAME).then(cache => cache.put('./index.html', response.clone()));
      return response;
    }).catch(async () => (await caches.match('./index.html')) || Response.error()));
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(async response => {
    if (response.ok) await caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});
