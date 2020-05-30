import { envEndpointOrigin } from './EnvHelpers.js'
import { trackPromise } from 'react-promise-tracker'

export async function storeInIndexedDB(item) {
    let request = await window.indexedDB.open('observation_db', 3)
    return trackPromise(
        new Promise((resolve, reject) => {
            request.onerror = function(err) {
                console.log('Database failed to open')
                reject("error")
            }

            request.onsuccess = function(e) {
                let db = e.target.result
                console.log('Database opened successfully')
                let transaction = db.transaction(['observation_data_os'], 'readwrite')
                let request     = transaction.objectStore('observation_data_os').add(item)

                request.onsuccess = function() {
                    // Don't resolve here because we want to resolve when transaction fires oncomplete
                    // That way, we can register a sync with the service worker
                    console.log("Stored observation request in IndexedDB")
                }

                request.onerror = function(err) {
                    reject("error")
                }

                transaction.oncomplete = function() {
                    console.log('Transaction succeeded')
                    console.log('Attempting a background sync of observation data')
                    if ('serviceWorker' in navigator && 'SyncManager' in window) {
                        navigator.serviceWorker.ready.then((registration) => {
                            registration.sync.register('observationSync')
                            .then(() => {
                                console.log("Registered a sync")
                                resolve("success")
                            })
                            .catch((err) => {
                                console.log(err)
                                reject("error")
                            })
                        })
                    } else {
                        console.log("This browser is unsupported.")
                        reject("error")
                    }
                }

                transaction.onerror = function(err) {
                    console.log('Transaction could not be opened')
                    reject("error")
                }
            }

            request.onupgradeneeded = function(e) {
                let db = e.target.result
                let objectStore = db.createObjectStore('observation_data_os', { keyPath: 'id', autoIncrement:true })
                objectStore.createIndex('img_string',   'img_string',   { unique: false })
                objectStore.createIndex('file_type',    'file_type',    { unique: false })
                objectStore.createIndex('project_id',   'project_id',   { unique: false })
                objectStore.createIndex('date',         'date',         { unique: false })
                objectStore.createIndex('title',        'title',        { unique: false })
                objectStore.createIndex('notes',        'notes',        { unique: false })
                objectStore.createIndex('measurements', 'measurements', { unique: false })
                console.log('Database setup complete')
            }
        })
    )
}

export async function sendImmediately(payload) {
    if (payload.img_string) {
        let response = await trackPromise(postImage(payload))
        if (response.status == '200' || response.status == '201') {
             let data = await response.json()
             delete payload.img_string
             payload.image[0].file_name = data[0].filename
             payload.image[0].file_path = 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/'
             return trackPromise(postObservationData(payload))
         } else {
             return response
         }
    } else {
        return trackPromise(postObservationData(payload))
    }
}

async function postImage(payload) {
    const img_payload = {
        "img_string": payload.img_string,
        "file_type":  payload.image[0].file_type
    }

    const [endpoint, origin] = envEndpointOrigin('api/s3/images')
    return fetch(endpoint, {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Host": "localhost",
            "Origin": origin
        },
        body: JSON.stringify(img_payload)
    })
}

async function postObservationData(payload) {
    const [endpoint, origin] = envEndpointOrigin('api/projects/' + payload.project_id + '/observations')
    return fetch(endpoint, {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Host":         "localhost",
            "Origin":       origin
        },
        body: JSON.stringify(payload)
    })
}

export function post(newItem) {
    if (!window.navigator.onLine && 'serviceWorker' in navigator ) {
        storeInIndexedDB(newItem).then((e) => {
            alert("Your device appears to be offline. We will attempt to upload your observation once connectivity is restored. Please check back to make sure your observation was recored.")
            window.location.replace('/observations?pid=' + newItem.project_id)
        })
        .catch((e) => {
             alert("Your device appears to be offline. We tried to store your obseration to upload later, but something went wrong. Please try again.")
        })
    } else {
        sendImmediately(newItem).then((response) => {
            if (response.status == '200' || response.status == '201') {
                window.location.replace('/observations?pid=' + newItem.project_id)
            } else {
                alert(`Your observation could not be saved. Please try again!\nError code: ${response.status}`)
            }
        })
    }
}

