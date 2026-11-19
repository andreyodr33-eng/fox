const CACHE_NAME = "horse-race-v1";

const APP_FILES = [
"./",
"./index.html",
"./bets.html",
"./ticket.html",
"./qrcode.min.js",

"./horse-frames/horse0.png",
"./horse-frames/horse01.png",
"./horse-frames/horse02.png",
"./horse-frames/horse03.png",
"./horse-frames/horse04.png",
"./horse-frames/horse05.png",
"./horse-frames/horse06.png",
"./horse-frames/horse07.png",
"./horse-frames/horse08.png",
"./horse-frames/horse09.png",
"./horse-frames/horse10.png",
"./horse-frames/horse11.png",
"./horse-frames/horse12.png",

"./horse-frames/icon-32.png",
"./horse-frames/icon-180.png",
"./horse-frames/icon-192.png",
"./horse-frames/icon-512.png"
];

// Установка
self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(APP_FILES))
.then(() => self.skipWaiting())
);
});

// Активация
self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(names =>
Promise.all(
names
.filter(name =>
name.startsWith("horse-race-") &&
name !== CACHE_NAME
)
.map(name => caches.delete(name))
)
).then(() => self.clients.claim())
);
});

// Обработка запросов
self.addEventListener("fetch", event => {
if (event.request.method !== "GET") return;

const url = new URL(event.request.url);

if (url.origin !== self.location.origin) return;

// Страницы
if (event.request.mode === "navigate") {
event.respondWith(
fetch(event.request)
.then(response => {
if (response.ok) {
const copy = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, copy));
      }

      return response;
    })
    .catch(async () => {
      return await caches.match(event.request, {
        ignoreSearch: true
      }) || await caches.match("./index.html");
    })
);

return;
}

// Остальные ресурсы
event.respondWith(
caches.match(event.request).then(cached => {
if (cached) return cached;

  return fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();

      caches.open(CACHE_NAME)
        .then(cache => cache.put(event.request, copy));
    }

    return response;
  });
})
);
});