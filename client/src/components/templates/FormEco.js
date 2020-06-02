import React, { useState } from "react";

//  Code taken from component documentation at:  
//  https://www.npmjs.com/package/react-popupbox
//  https://fraina.github.io/react-popupbox/
//
//  Credit these site for significant portions of this code

function FormBio(){
    const [date, setDate] = useState("")
    const [title, setName] = useState("")
    const [notes, setNotes] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")

    const submitForm = (e) => {

        // Create JSON from Data
        // Make Images API Call
        // Handle Error
        // Then Make API call to save observation
        // Handle Errors
        // Redirect
        e.preventDefault();
        console.log({date})
        console.log({title})
        console.log({notes})
        console.log({latitude})
        console.log({longitude})
    }


    return (
        <div>
            <h2>Ecology Observation Form</h2>
            <form onSubmit = {submitForm} >
                <input
                placeholder="Date"
                type="date"
                name={date}
                onChange={e => setDate(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Title"
                type="text"
                name={title}
                onChange={e => setName(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Notes"
                type="textbox"
                name={notes}
                onChange={e => setNotes(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Latitude"
                type="text"
                name={latitude}
                onChange={e => setLatitude(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Longitude"
                type="text"
                name={longitude}
                onChange={e => setLongitude(e.target.value)}
                required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default FormBio;