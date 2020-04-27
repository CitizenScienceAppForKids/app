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
	'/projects/visualization'
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
	let db;
	// pull post request from indexedDB
	request = indexedDB.open("image_db");
	request.addEventListener('success', (e) => {
		db = e.target.result;
		db.transaction('images_os').objectStore('images_os').get(47).addEventListener('success', (e) => {
			const requestBody = { "base64_string": e.target.result.img_string };
			fetch('/decode', {
				method: 'post',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(requestBody)
			})
			.then(() => {
					console.log("Something went okay");
			})
			.catch(() => {
				console.log("Somthing is borked");
			});
		});
	});

	request.addEventListener('error', (e) => {
		console.log("Couldn't open database in service worker!");
	});

	// clear the entry from indexed DB
}
