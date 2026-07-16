// NovaPOS PRO — Service Worker v2.0
// v2: se sube el número de versión del caché a propósito, para que el
// navegador detecte que este archivo cambió y reemplace al Service Worker
// anterior. Además, el shell de la app (index.html, manifest, iconos) ahora
// usa "red primero, caché como respaldo" en vez de "caché primero" — así,
// cada vez que subas un index.html nuevo, se aplica solo en la siguiente
// carga, sin necesitar este mismo truco de nuevo.
const CACHE = 'novapos-v2';
const ASSETS = ['./', './index.html', './manifest-nova.json', './icon-nova-192.png', './icon-nova-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(u => c.add(u).catch(()=>{}))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Google Sheets / Apps Script: siempre red, nunca caché (son datos en vivo).
  if (url.hostname.includes('script.google.com') || url.hostname.includes('googleapis.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response(JSON.stringify({ok:false,error:'Sin conexión'}),{headers:{'Content-Type':'application/json'}})));
    return;
  }

  // Fuentes de Google: caché primero, está bien porque casi nunca cambian.
  if (url.hostname.includes('fonts.google') || url.hostname.includes('fonts.gstatic')) {
    e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => { const cl=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cl)); return r; })));
    return;
  }

  // Shell de la app (HTML, manifest, íconos): red primero. Si subes un
  // index.html nuevo, la siguiente carga lo trae directo del servidor y
  // actualiza la caché; solo se usa la caché guardada si no hay conexión.
  e.respondWith(
    fetch(e.request)
      .then(r => { if (r && r.status===200 && r.type!=='opaque') { const cl=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cl)); } return r; })
      .catch(() => caches.match(e.request))
  );
});
self.addEventListener('message', e => { if(e.data==='skipWaiting') self.skipWaiting(); });
