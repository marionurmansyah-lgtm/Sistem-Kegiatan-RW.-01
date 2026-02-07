const CACHE_NAME = 'rw01-v1';
const assets = [
  './',
  './index.html',
  'https://scvydobptkuvfthligiw.supabase.co/storage/v1/object/public/Logo/1746898459176.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
