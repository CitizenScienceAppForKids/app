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
	if (e.tag === 'observationSync') {
		e.waitUntil(uploadPendingObservations())
	} else {
	  console.log('Service Worker got a sync, but could not resolve the tag!')
	}
})

function uploadPendingObservations() {
	let db
	var request = indexedDB.open("observation_db")
	request.addEventListener('success', (e) => {
		db = e.target.result;
		db.transaction('observation_data_os').objectStore('observation_data_os').getAll().addEventListener('success', (e) => {
			e.target.result.forEach((observation) => {
				if (observation.img_string) {
					postImageThenObservationData(observation)	
				} else {
					postObservationData(observation)
				}

				// TODO clear the entry from indexed DB
			})
		})
	})

	request.addEventListener('error', (e) => {
		console.log("Couldn't open database in service worker! Can't post observations!");
	})

}

function postImageThenObservationData(payload) {
		// TODO create endpoint and origin for staging and production
		const img_payload = (({ img_string, file_type }) => ({ img_string, file_type }))(payload);
		delete payload.img_string	
		fetch('/api/s3/images', {
			method: 'post',
			headers: {
				"Content-Type": "application/json",
				"Host": "localhost",
				"Origin": "localhost"
			},
			body: JSON.stringify(img_payload)
		})
		.then((response) => {
			console.log(response)
			// postObservationData(payload)	
		})
		.catch((err) => {
			console.log(err)
		})
}

function postObservationData(payload) {
		const endpoint = '/projects/' + payload.project_id + '/observations'
		fetch(endpoint, {
			method: 'post',
			headers: {
				"Content-Type": "application/json",
				"Host":			"localhost",
				"Origin": 		"localhost"
			},
			body: JSON.stringify(payload)
		})
		.then((response) => {
			postObservationData(payload)	
		})
		.catch((err) => {
			console.log(err)
		})
}
