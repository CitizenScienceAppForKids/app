import React, { useState, useEffect } from "react";
import Cam from '../../pages/Cam';
import "react-popupbox/dist/react-popupbox.css"
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import * as FormPost from '../FormPost.js'
import {usePosition} from '../usePosition';
import PropTypes from 'prop-types';
import './form-style.css'
import { LoadingSpinnerComponent } from './formSpinner.js'

function FormEco(params, watch, settings){

    const {
        latitude,
        longitude,
    } = usePosition(watch, settings);

    const [date,       setDate      ] = useState("")
    const [time,       setTime      ] = useState("")
    const [title,      setName      ] = useState("")
    const [notes,      setNotes     ] = useState("")
    const [commonName, setCommonName] = useState("")
    const [genus,      setGenus     ] = useState("")
    const [species,    setSpecies   ] = useState("")
    const [lat,        setLat       ] = useState("")
    const [long,       setLong      ] = useState("")

    useEffect(() => {
        setLat(latitude);
        setLong(longitude);
    }, [latitude, longitude]);

    const submitForm = (e, props) => {
        e.preventDefault()
        let newItem = {
            project_id:   params.id,
            date:         date + " " + time,
            title:        title,
            notes:        notes,
            measurements: {
                "Genus": genus,
                "Species": species,
                "Common Name": commonName
            },
            latitude:     lat,
            longitude:    long
        }

        // Expecting an image dataURI to be stored in localStorage
        var imgData
        if (window.localStorage.images) {
            imgData                     = JSON.parse(window.localStorage.images)[0]
            var s                       = imgData.split(',')[0]
            newItem.image               = [{}]
            newItem.image[0].file_type  = '.' + s.substring(s.lastIndexOf('/') + 1, s.lastIndexOf(';'))
            newItem.img_string          = imgData.split(',')[1]

            localStorage.removeItem("images")
        }

        if (!window.navigator.onLine && 'serviceWorker' in navigator ) {
            FormPost.storeInIndexedDB(newItem)
            alert("Your device appears to be offline. We will attempt to upload you observation once connectivity is restored. Please check back to make sure your observation was recored.")
            window.location.replace('/observations?pid=' + params.id)
        } else {
            FormPost.sendImmediately(newItem).then((response) => {
                if (response.status == '200' || response.status == '201') {
                    window.location.replace('/observations?pid=' + params.id)
                } else {
                    alert(`Your observation could not be saved. Please try again!\nError code: ${response.status}`)
                }
            })
        }
    }


    const popupboxConfig = {
        titleBar: {
          enable: true,
          text: 'Camera'
        },
        fadeIn: true,
        fadeInSpeed: 500
    }

    function openPopupbox(value) {
        const content = (
          <div>
            <Cam />
          </div>
        )
        PopupboxManager.open({ content })
    }

    return (
        <div >
            <LoadingSpinnerComponent />
            <h2>Enter a new observation below:</h2>
            <form onSubmit = {submitForm} >
                <input
                class="input"
                placeholder="Date"
                type="date"
                name={date}
                onChange={e => setDate(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Time"
                type="time"
                step="1"
                name={time}
                onChange={e => setTime(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Title"
                type="text"
                name={title}
                onChange={e => setName(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Notes"
                type="textbox"
                name={notes}
                onChange={e => setNotes(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Common Name"
                type="textbox"
                name={commonName}
                onChange={e => setCommonName(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Genus"
                type="textbox"
                name={genus}
                onChange={e => setGenus(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Species"
                type="textbox"
                name={species}
                onChange={e => setSpecies(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Latitude"
                type="text"
                name={latitude}
                defaultValue={lat}
                onChange={e => setLat(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Longitude"
                type="text"
                name={longitude}
                defaultValue={long}
                onChange={e => setLong(e.target.value)}
                required
                />
                <br />
                <button
                type="button"
                onClick={() => openPopupbox()}
                >Take Pic</button>
                <br /><br />
                <button type="submit">Submit</button>
            </form>
            <PopupboxContainer {...popupboxConfig } />
        </div>
    )
}

FormEco.propTypes = {
    watch: PropTypes.bool,
    settings: PropTypes.object,
};

export default FormEco
