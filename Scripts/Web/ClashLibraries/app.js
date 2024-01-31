// self.addEventListener('install', (e) => {
// 	e.waitUntil(
// 		caches.open('error.html').then((cache) => cache.addAll([
// 			'/'
// 		])),
// 	);
// });

// self.addEventListener('fetch', (e) => {
// 	e.respondWith(
// 		caches.match(e.request).then(function (response) {
// 			return response || fetch(e.request);
// 		})
// 	);
// });// Cache files
const CACHE_NAME = 'capture-clash-chache-v1';
const urlsToCache = [
  '/',
  '/Home.html',
  '/assests/css/style.css',
  '/index.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Serve cached content
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Update cache
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if(!cacheWhitelist.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      })
    ))  
  );
});

// Push notifications
self.addEventListener('push', function(event) {
  const title = 'New content available';
  const options = {
    body: 'Click to view new content',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', function(event) {
  // Do something, e.g. open window/tab
  event.notification.close();
});
