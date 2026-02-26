// ✅ Service Worker untuk Sinergi RW.01 - Cache Strategy: Cache First, Fallback to Network

const CACHE_NAME = 'sinergi-rw01-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap',
  'https://kbzlgrpeerllbvpiyhpf.supabase.co/storage/v1/object/public/Logo/1746898459176.png'
];

// ✅ Install: Cache aset statis
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Cache dibuka:', CACHE_NAME);
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.log('⚠️ Gagal cache awal:', err))
  );
  self.skipWaiting();
});

// ✅ Activate: Bersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ✅ Fetch: Cache First, Fallback ke Network
self.addEventListener('fetch', (event) => {
  // ✅ Skip untuk request API Supabase & WhatsApp (harus live)
  if (
    event.request.url.includes('supabase.co') || 
    event.request.url.includes('wa.me') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        // ✅ Cache response baru jika valid
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // ✅ Fallback ke index.html untuk navigasi (SPA support)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});