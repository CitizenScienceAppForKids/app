// Boilerplate code sourced from https://developers.google.com/web/fundamentals/primers/service-workers
// Background sync code outline sourced from https://ponyfoo.com/articles/backgroundsync

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
	'/about',
	'/observations/new',
	'/observations',
	'/projects',
	'/projects/specific-project',
	'/projects/visualiation'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('sync', function(event) {
  if (event.tag == 'myFirstSync') {
    event.waitUntil(uploadImage());
  }
});

function uploadImage() {
	// pull post request from indexedDB
	// store the image on the server
	// make post request to store the image in the images table
	// clear the entry from indexed DB
};

