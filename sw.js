const CACHE_NAME = "dienstgrade-cache-v74";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Alte Caches (z.B. "v1") loeschen, damit auch schon mal offline
// geladene, veraltete Dateien (style.css usw.) nicht liegen bleiben.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(namen.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Bilder aendern sich selten: zuerst aus dem Cache (sofort da), nur wenn
// noch nicht vorhanden aus dem Netz. Bei einer neuen Version (CACHE_NAME
// hochzaehlen) wird der Cache ohnehin geleert.
// Alles andere (HTML/JS/CSS): erst Netz, bei Erfolg im Cache ablegen,
// ohne Netz aus dem Cache - so bleibt die App offline nutzbar.
const IST_BILD = /\.(webp|jpg|jpeg|png|svg|pdf)$/i;

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  if (IST_BILD.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((treffer) => treffer || fetch(event.request).then((antwort) => {
        if (antwort.ok) {
          const kopie = antwort.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, kopie));
        }
        return antwort;
      }))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((antwort) => {
        const kopie = antwort.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, kopie));
        return antwort;
      })
      .catch(() => caches.match(event.request))
  );
});
