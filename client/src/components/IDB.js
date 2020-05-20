export function storeInIndexedDB(newItem, imgData) {
	console.log("Adding new item to indexedDB.")
    if (imgData) {
        var s                    = imgData.split(',')[0]
        newItem.image            = {}
        newItem.image.file_type  = s.substring(s.lastIndexOf('/') + 1, s.lastIndexOf(';'))
        newItem.img_string       = imgData.split(',')[1]
        storeItem(newItem)
    } else {
        storeItem(newItem)
    }
}

async function storeItem(item) {
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
		objectStore.createIndex('img_string', 	'img_string', 	{ unique: false })
		objectStore.createIndex('file_type', 	'file_type', 	{ unique: false })
		objectStore.createIndex('project_id', 	'project_id', 	{ unique: false })
		objectStore.createIndex('date', 	  	'date', 		{ unique: false })
		objectStore.createIndex('title',      	'title', 		{ unique: false })
		objectStore.createIndex('notes',      	'notes', 		{ unique: false })
		objectStore.createIndex('measurements', 'measurements', { unique: false })
		console.log('Database setup complete')
	}
}
