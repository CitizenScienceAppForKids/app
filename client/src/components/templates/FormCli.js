import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom'
import Cam from '../../pages/Cam';
import "react-popupbox/dist/react-popupbox.css"
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import * as FormPost from '../FormPost.js'
import {usePosition} from '../usePosition';
import PropTypes from 'prop-types';
import './form-style.css'
import { LoadingSpinnerComponent } from './formSpinner.js'


//  Code taken from component documentation at:  
//  https://www.npmjs.com/package/react-popupbox
//  https://fraina.github.io/react-popupbox/
//
//  Credit these site for significant portions of this code

function FormCli(params, watch, settings){
    const [submitted,  setSubmitted ] = useState(false)

    const {
        latitude,
        longitude,
    } = usePosition(watch, settings);

    const [date,          setDate          ] = useState("")
    const [time,          setTime          ] = useState("")
    const [title,         setName          ] = useState("")
    const [notes,         setNotes         ] = useState("")
    const [temperature,   setTemperature   ] = useState("")
    const [windSpeed,     setWindSpeed     ] = useState("")
    const [precipitation, setPrecipitation ] = useState("")
    const [lat,           setLat           ] = useState("")
    const [long,          setLong          ] = useState("")

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
                "Temperature (F)":    temperature,
                "Wind Speed (m/s)":   windSpeed,
                "Precipitation (mm)": precipitation
            },
            latitude:     lat,
            longitude:    long
        }
        FormPost.post(newItem)
        .then(() => {
            setSubmitted(true)
        })
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
                placeholder="Temperature (F)"
                type="number"
                min="-459.67"
                max="1000"
                step="0.01"
                name={temperature}
                onChange={e => setTemperature(e.target.value)}
                required
                />
                <input
                class="input"
                placeholder="Wind Speed (m/s)"
                type="number"
                min="0"
                max="500"
                step="0.01"
                name={windSpeed}
                onChange={e => setWindSpeed(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Precipitation (mm)"
                type="number"
                min="0"
                max="2540"
                step="0.01"
                name={precipitation}
                onChange={e => setPrecipitation(e.target.value)}
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
                class="input"
                type="button"
                onClick={() => openPopupbox()}
                >Take Pic</button>
                <br /><br />
                <button type="submit">Submit</button>
            </form>
            <PopupboxContainer {...popupboxConfig } />
            {submitted && <Redirect to={'/observations?pid=' + params.id} />}
        </div>
    )
}

FormCli.propTypes = {
    watch: PropTypes.bool,
    settings: PropTypes.object,
};

export default FormCli
