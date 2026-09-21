const CACHE_NAME = "dienstgrade-cache-v30";

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

// Einfache Strategie: erst versuchen aus dem Netz zu laden, bei Erfolg
// im Cache ablegen; klappt kein Netz, aus dem Cache bedienen. So
// funktioniert die App auch offline, sobald sie einmal geladen wurde.
self.addEventListener("fetch", (event) => {
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
