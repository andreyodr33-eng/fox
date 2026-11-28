const CACHE_NAME = "horse-race-v4";

const APP_FILES = [
"./",
"./index.html",
"./bets.html",
"./ticket.html",
"./qrcode.min.js",
"./horse.wav",        

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
"./horse-frames/icon-512.png",

  // Белая лошадь
"./horse1/horse0.png",
"./horse1/horse01.png",
"./horse1/horse02.png",
"./horse1/horse03.png",
"./horse1/horse04.png",
"./horse1/horse05.png",
"./horse1/horse06.png",
"./horse1/horse07.png",
"./horse1/horse08.png",
"./horse1/horse09.png",
"./horse1/horse10.png",
"./horse1/horse11.png",
"./horse1/horse12.png",

// Каштановая лошадь
"./horse2/horse0.png",
"./horse2/horse01.png",
"./horse2/horse02.png",
"./horse2/horse03.png",
"./horse2/horse04.png",
"./horse2/horse05.png",
"./horse2/horse06.png",
"./horse2/horse07.png",
"./horse2/horse08.png",
"./horse2/horse09.png",
"./horse2/horse10.png",
"./horse2/horse11.png",
"./horse2/horse12.png",

// Аппалуза
"./horse3/horse0.png",
"./horse3/horse01.png",
"./horse3/horse02.png",
"./horse3/horse03.png",
"./horse3/horse04.png",
"./horse3/horse05.png",
"./horse3/horse06.png",
"./horse3/horse07.png",
"./horse3/horse08.png",
"./horse3/horse09.png",
"./horse3/horse10.png",
"./horse3/horse11.png",
"./horse3/horse12.png",

// Буланая лошадь
"./horse4/horse0.png",
"./horse4/horse01.png",
"./horse4/horse02.png",
"./horse4/horse03.png",
"./horse4/horse04.png",
"./horse4/horse05.png",
"./horse4/horse06.png",
"./horse4/horse07.png",
"./horse4/horse08.png",
"./horse4/horse09.png",
"./horse4/horse10.png",
"./horse4/horse11.png",
"./horse4/horse12.png"      
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
