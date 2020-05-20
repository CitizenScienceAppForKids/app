import React, { useEffect, useState } from "react";
import '../components/AsyncFileUpload.js';

function TestObservationPage(){
    return (
		<form id="testSubmitForm" >
		  <label>
			Name:
			<input type="text" 	id="projectID" />
			<input type="text" 	id="date" />
			<input type="text" 	id="title" />
			<input type="text" 	id="notes" />
			<input type="text" 	id="measurements" /><br/>
			<input type="file" id="image" />
		  </label>
		  <input id="testSubmit" type="submit" value="Submit" />
		</form>	
    )
}

export default TestObservationPage;
