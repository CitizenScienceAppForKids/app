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

async function uploadPendingObservations() {
    let db
    var request = indexedDB.open("observation_db")
    request.addEventListener('success', (e) => {
        db = e.target.result;
        transaction = db.transaction('observation_data_os', 'readwrite').objectStore('observation_data_os')
        transaction.getAllKeys().addEventListener('success', (e) => {
            e.target.result.forEach((key) => {
                transaction.get(key).addEventListener('success', (e) => {
                    console.log(`Observation ${e.target.result}`)
                    observation = e.target.result
                    if (observation.img_string) {
                        postImage(observation).then((response) => {
                            if (response.status == '200' || response.status == '201') {
                                delete observation.img_string
                                observation.image[0].file_name = response.data[0].filename
                                observation.image[0].file_path = 'https://cab-cs467-images.s3-us-west-1.amazonaws.com'
                                postObservationData(observation).then((response) => {
                                    if (response.status == '200' || response.status == '201') {
                                        db.transaction('observation_data_os', 'readwrite')
                                            .objectStore('observation_data_os')
                                            .delete(key)
                                    }
                                })
                            }
                        })
                    } else {
                        postObservationData(observation).then((response) => {
                            if (response.status == '200' || response.status == '201') {
                                db.transaction('observation_data_os', 'readwrite')
                                    .objectStore('observation_data_os')
                                    .delete(key)
                            }
                        })
                    }
                }) 
            })
        })
    })

    request.addEventListener('error', (e) => {
        console.log("Couldn't open database in service worker! Can't post observations!");
    })

}
// This is repeat code from FormPost.js - unfortunately, there is not import support for service workers...
async function postImage(payload) {
    const img_payload = {
        "img_string": payload.img_string,
        "file_type":  payload.image[0].file_type
    }

    const [endpoint, origin] = fetchArgs('api/s3/images')
    let response = await fetch(endpoint, {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Host": "localhost",
            "Origin": origin
        },
        body: JSON.stringify(img_payload)
    })
    let data = await response.json()
    return { "status": response.status, "data": data }
}

async function postObservationData(payload) {
    const [endpoint, origin] = fetchArgs('api/projects/' + payload.project_id + '/observations')
    let response = await fetch(endpoint, {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Host":         "localhost",
            "Origin":       origin
        },
        body: JSON.stringify(payload)
    })
    let data = await response.json()
    return { "status": response.status, "data": data }
}

function fetchArgs(baseEndpoint) {
//    const endpoint = (self.location.hostname === "localhost") ?
//        "http://localhost:5000/" + baseEndpoint :
//        "https://cab-cs467.net:443/" + baseEndpoint
//    const origin   = (self.location.hostname === "localhost") ?
//        "localhost" :
//        "cab-cs467.net"
//    return [endpoint, origin]
    return ["https://cab-cs467.net:443/" + baseEndpoint, "cab-cs467.net"]
}
