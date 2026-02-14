// sw.js - Service Worker Sederhana
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // Biarkan request lewat secara normal
});
