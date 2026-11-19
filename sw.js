const CACHE_NAME = 'tees-lab-shell-v23';
const APP_FILES = [
  './index.html', './manifest.json', './logo.jpg', './version.json',
  './assets/samples/golden-hour.jpg',
  './assets/samples/neon-street.jpg',
  './assets/samples/forest.jpg',
  './assets/samples/portrait.jpg',
  './assets/samples/coffee.jpg',
  './assets/samples/ocean.jpg',
  './assets/fonts/Caveat-TeeLab.woff2',
  './assets/gear/bodies/rollie-35.webp',
  './assets/gear/bodies/fuji-tx1.webp',
  './assets/gear/bodies/leica-m6.webp',
  './assets/gear/bodies/contax-t2.webp',
  './assets/gear/bodies/hasselblad-500.webp',
  './assets/gear/bodies/nikon-f2.webp',
  './assets/gear/bodies/nikon-fm2.webp',
  './assets/gear/bodies/canon-ae1.webp',
  './assets/gear/bodies/pentax-k1000.webp',
  './assets/gear/bodies/olympus-om1.webp',
  './assets/gear/bodies/minolta-srt101.webp',
  './assets/gear/lenses/helios-44.webp',
  './assets/gear/lenses/nikon-50-18.webp',
  './assets/gear/lenses/canon-fd-50.webp',
  './assets/gear/lenses/olympus-zuiko-50.webp',
  './assets/gear/lenses/pentax-k-50-12.webp',
  './assets/gear/lenses/minolta-rokkor-58-12.webp',
  './assets/gear/lenses/leica-summilux-35.webp',
  './assets/gear/lenses/leica-noctilux-50.webp',
  './assets/gear/lenses/hasselblad-planar-80.webp',
  './assets/gear/lenses/fuji-xpan-45.webp',
  './assets/gear/lenses/contax-t2-sonnar.webp',
  './assets/gear/lenses/rollei-sonnar-40.webp',
  './assets/gear/films/fuji-pro-400h.webp',
  './assets/gear/films/fuji-superia-400.webp',
  './assets/gear/films/fuji-classic-chrome.webp',
  './assets/gear/films/fuji-classic-neg.webp',
  './assets/gear/films/fuji-velvia-50.webp',
  './assets/gear/films/fuji-astia-100f.webp',
  './assets/gear/films/fuji-natura-1600.webp',
  './assets/gear/films/kodak-portra-400.webp',
  './assets/gear/films/kodak-portra-160.webp',
  './assets/gear/films/kodak-portra-800.webp',
  './assets/gear/films/kodak-gold-200.webp',
  './assets/gear/films/kodak-ultramax-400.webp',
  './assets/gear/films/kodak-colorplus-200.webp',
  './assets/gear/films/kodak-ektar-100.webp',
  './assets/gear/films/kodak-e100.webp',
  './assets/gear/films/cinestill-800t.webp',
  './assets/gear/films/cinestill-50d.webp',
  './assets/gear/films/ilford-hp5.webp',
  './assets/gear/films/kodak-trix-400.webp',
  './assets/gear/films/fuji-acros-100.webp'
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
