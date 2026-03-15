const CACHE_NAME = 'mini-games-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './games/tetris.html',
  './games/snake.html',
  './games/memory.html',
  './games/pong.html',
  './games/tictactoe.html',
  './games/runner.html',
  './games/puzzle.html',
  './games/breakout.html',
  './games/flappy.html',
  './games/whack.html',
  './games/2048.html',
  './games/minesweeper.html',
  './games/invaders.html',
  './games/simon.html',
  './games/asteroids.html',
  './img/icon-512.png',
  './img/icon-256.png',
  './img/icon-128.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      // Cache-first, fall back to network, then update cache
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
