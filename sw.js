const CACHE_NAME = "dienstgrade-cache-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
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
