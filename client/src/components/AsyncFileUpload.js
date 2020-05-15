// This will register a sync with the service worker as soon as the worker is ready
if ('serviceWorker' in navigator && 'SyncManager' in window) {
	navigator.serviceWorker.ready.then((registration) => {
		document.getElementById('testSubmit').addEventListener('click', (e) => {
			registration.sync.register('observationSync')
			.then(() => {
				console.log("Registered a sync")
			})
			.catch((err) => {
				console.log(err)
				return err
			})
		})
	})
} else {
	console.log("This browser is unsupported.")
}

// This should be attached to the form itself to override submit logic
window.addEventListener("DOMContentLoaded", function() {
	document.getElementById('testSubmitForm').addEventListener('submit', submitForm);
});

let db;

window.addEventListener("load", function() {
	let request = window.indexedDB.open('observation_db', 3);

	request.onerror = function() {
		console.log('Database failed to open');
	};

	request.onsuccess = function() {
		console.log('Database opened successfully');
		db = request.result;
	};

	request.onupgradeneeded = function(e) {
		let db = e.target.result;
		
		let objectStore = db.createObjectStore('observation_data_os', { keyPath: 'id', autoIncrement:true });
		objectStore.createIndex('img_string', 	'img_string', 	{ unique: false });
		objectStore.createIndex('file_type', 	'file_type', 	{ unique: false });
		objectStore.createIndex('project_id', 	'project_id', 	{ unique: false });
		objectStore.createIndex('date', 	  	'date', 		{ unique: false });
		objectStore.createIndex('title',      	'title', 		{ unique: false });
		objectStore.createIndex('notes',      	'notes', 		{ unique: false });
		objectStore.createIndex('measurements', 'measurements', { unique: false });

		console.log('Database setup complete');
	};
});


function submitForm(e) {
	e.preventDefault();

	// ids of form fields for a new observation
	const IMAGE_FIELD 		 = 'image';
	const PROJECT_ID_FIELD 	 = 'projectID';
	const DATE_FIELD 		 = 'date';
	const TITLE_FIELD 		 = 'title';
	const NOTES_FIELD 		 = 'notes';
	const MEASUREMENTS_FIELD = 'measurements';

	console.log("Submitting");

	var formElements = e.target.elements;

	let newItem = { 
		project_id:   formElements.namedItem(PROJECT_ID_FIELD).value,
		date: 		  formElements.namedItem(DATE_FIELD).value,
		title: 		  formElements.namedItem(TITLE_FIELD).value,
		notes: 		  formElements.namedItem(NOTES_FIELD).value,
		measurements: formElements.namedItem(MEASUREMENTS_FIELD).value
	};

	var reader = new FileReader();

	reader.addEventListener("load", (e) => {
		// FileRead appends the type to the front of the base64 string - consider moving split logic to server
		newItem.file_type  = e.target.result.split(',')[0];
		newItem.img_string = e.target.result.split(',')[1];
		storeInIndexedDB(newItem);
	});

	var imgFile = formElements.namedItem(IMAGE_FIELD).files[0];
	
	if (imgFile) {
		reader.readAsDataURL(imgFile);	
	} else {
		storeInIndexedDB(newItem);
	}
}

function storeInIndexedDB(newItem) {
	// grab the values entered into the form fields and store them in an object ready for being inserted into the DB
	console.log("Adding new item to indexedDB.");
	
	// open a read/write db transaction, ready for adding the data
	let transaction = db.transaction(['observation_data_os'], 'readwrite');

	// call an object store that's already been added to the database
	let objectStore = transaction.objectStore('observation_data_os');

	// Make a request to add our newItem object to the object store
	let request = objectStore.add(newItem);
	request.onsuccess = function() {
		console.log("Successfully stored new element to IndexedDB.");
		// TODO Clear the form, ready for adding the next entry
	};

	// Report on the success of the transaction completing, when everything is done
	transaction.oncomplete = function() {
		console.log('Transaction completed: database modification finished.');
	};

	transaction.onerror = function() {
		console.log('Transaction not opened due to error');
	};

}
