import React, { useState, useEffect } from "react";
import Cam from '../../pages/Cam';
import "react-popupbox/dist/react-popupbox.css"
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import {usePosition} from '../usePosition';
import PropTypes from 'prop-types';

function FormBio(params, watch, settings){

    const {
        latitude,
        longitude,
    } = usePosition(watch, settings);
      
    const [date, setDate] = useState("")
    const [title, setName] = useState("")
    const [notes, setNotes] = useState("")
    const [genus, setGenus] = useState("")
    const [species, setSpecies] = useState("")
    const [lat, setLat] = useState(latitude)
    const [long, setLong] = useState(longitude)

    useEffect(() => {
        setLat(latitude);
        setLong(longitude);
    }, [latitude, longitude]);

    const submitForm = (e,props) => {
        e.preventDefault();
        console.log(params.id)
        console.log({date})
        console.log({title})
        console.log({notes})
        console.log({genus})
        console.log({species})
        console.log({lat})
        console.log({long})
        if (window.localStorage.images){
            console.log(JSON.parse(window.localStorage.images))
            localStorage.removeItem("images")
        }

        window.location.replace('/observations?pid=' + params.id)
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
        <div>
            <h2>Biology Observation Form</h2>
            <form onSubmit = {submitForm} >
                <input
                placeholder="Date"
                type="datetime-local"
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
                placeholder="Genus"
                type="textbox"
                name={genus}
                onChange={e => setGenus(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Species"
                type="textbox"
                name={species}
                onChange={e => setSpecies(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Latitude"
                type="text"
                name={latitude}
                defaultValue={lat}
                onChange={e => setLat(e.target.value)}
                required
                />
                <br />
                <input
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

FormBio.propTypes = {
    watch: PropTypes.bool,
    settings: PropTypes.object,
};

export default FormBio