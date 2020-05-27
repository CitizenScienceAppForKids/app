import { envEndpointOrigin } from './EnvHelpers.js'

async function storeInIndexedDB(item) {
    let request = await window.indexedDB.open('observation_db', 3)
    request.onerror = function() {
        console.log('Database failed to open')
    }

    request.onsuccess = function(e) {
        let db = e.target.result
        console.log('Database opened successfully')
        let transaction = db.transaction(['observation_data_os'], 'readwrite')
        let request     = transaction.objectStore('observation_data_os').add(item)

        request.onsuccess = function() {
            console.log("Stored observation request in IndexedDB")
            // TODO Clear the form, ready for adding the next entry
        }

        transaction.oncomplete = function() {
            console.log('Transaction succeeded')
            console.log('Attempting a background sync of observation data')
            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.sync.register('observationSync')
                    .then(() => {
                        console.log("Registered a sync")
                    })
                    .catch((err) => {
                        console.log(err)
                        return err
                    })
                })
            } else {
                console.log("This browser is unsupported.")
            }
        }

        transaction.onerror = function() {
            console.log('Transaction could not be opened')
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
}

function sendImmediately(payload) {
    if (payload.img_string) {
        postImage(payload).then((response) => {
            if (response.status == '200' || response.status == '201') {
                delete payload.img_string
                payload.image[0].file_name = response.data[0].filename
                payload.image[0].file_path = 'https://cab-cs467-images.s3-us-west-1.amazonaws.com/'
                postObservationData(payload).then((response) => {
                    if (response.status == '200' || response.status == '201') {
                        // TODO
                        console.log('New observation saved successfully.')
                    }
                })
            }
        })
    } else {
        postObservationData(payload).then((response) => {
            if (response.status == '200' || response.status == '201') {
                // TODO
                console.log('New observation stored successfully.')
            }
        })
    }
}

export function post(newItem) {
     if (!window.navigator.onLine && 'serviceWorker' in navigator ) {
        storeInIndexedDB(newItem)
    } else {
        sendImmediately(newItem)
    }
}

async function postImage(payload) {
    const img_payload = {
        "img_string": payload.img_string,
        "file_type":  payload.image[0].file_type
    }

    const [endpoint, origin] = envEndpointOrigin('api/s3/images')
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
    const [endpoint, origin] = envEndpointOrigin('api/projects/' + payload.project_id + '/observations')
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
