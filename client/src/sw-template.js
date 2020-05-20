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
//
//    /* custom cache rules*/
//    workbox.routing.registerNavigationRoute('/index.html', {
//      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
//    });
//
//    workbox.routing.registerRoute(
//      /\.(?:png|gif|jpg|jpeg)$/,
//      workbox.strategies.cacheFirst({
//        cacheName: 'images',
//        plugins: [
//          new workbox.expiration.Plugin({
//            maxEntries: 60,
//            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//          }),
//        ],
//      })
//    );

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
        transaction = db.transaction('observation_data_os', 'readwrite').objectStore('observation_data_os')
		transaction.getAllKeys().addEventListener('success', (e) => {
            console.log(`Keys ${e.target.result}`)
			e.target.result.forEach((key) => {
			    transaction.get(key).addEventListener('success', (e) => {
                    console.log(`Observation ${e.target.result}`)
                    observation = e.target.result
                    new Promise(() => {
                        if (observation.img_string) {
                            postImageThenObservationData(observation)	
                        } else {
                            postObservationData(observation)
                        }
                    })
                    .then(() => {
                        transaction.delete(key)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }) 
			})
		})
	})

	request.addEventListener('error', (e) => {
		console.log("Couldn't open database in service worker! Can't post observations!");
	})

}

function postImageThenObservationData(payload) {
		// TODO create endpoint and origin for staging and production
        const img_payload = {
            "img_string": payload.img_string,
            "file_type":  payload.image.file_type
        }
        delete payload.img_string	
		fetch('http://localhost:5000/api/s3/images', {
			method: 'post',
			headers: {
				"Content-Type": "application/json",
				"Host": "localhost",
				"Origin": "localhost"
			},
			body: JSON.stringify(img_payload)
		})
		.then((response) => {
            if (response.status == '200' || response.status == '201') {
                response.json().then((body) => {
                    payload.image.file_name = body[0].key
                    payload.image.file_path = body[0].key
                    postObservationData(payload)
                })
            } else {
                console.log(`Could not store image ${response.status}`)
            }
		})
		.catch((err) => {
			console.log(err)
		})
}

function postObservationData(payload) {
		const endpoint = 'http://localhost:5000/api/projects/' + payload.project_id + '/observations'
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
			console.log(response)	
		})
		.catch((err) => {
			console.log(err)
		})
}
