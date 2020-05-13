// Boilerplate source: https://karannagupta.com/using-custom-workbox-service-workers-with-create-react-app/
self.__WB_MANIFEST
if ('function' === typeof importScripts) {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([]);

/* custom cache rules*/
workbox.routing.registerNavigationRoute('/index.html', {
      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
    });

workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg)$/,
      workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          }),
        ],
      })
    );

} else {
    console.log('Workbox could not be loaded. No Offline support');
  }
}

self.addEventListener('sync', (e) => {
	if (e.tag == 'observationSync') {
	console.log('asdf')
	e.waitUntil(uploadObservation())
	} else {
	  console.log('asdfasdfasd')
	}
})

function uploadObservation() {
	console.log("got here")
	return Promise.resolve('done')
	let db
	// pull post request from indexedDB
	var request = indexedDB.open("observation_db")
	request.addEventListener('success', (e) => {
		db = e.target.result;
		db.transaction('observation_data_os').objectStore('observation_data_os').getAll().addEventListener('success', (e) => {
			e.target.result.forEach((observation) => {
				fetch('/TODO', {
					method: 'post',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(observation)
				})
				.then(() => {
						console.log("Something went okay")
				})
				.catch(() => {
					console.log("Somthing is borked")
				})
			})
		})
	})

	request.addEventListener('error', (e) => {
		console.log("Couldn't open database in service worker!");
	})

	// TODO clear the entry from indexed DB
}
