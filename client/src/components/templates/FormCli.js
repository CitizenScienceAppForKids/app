import React, { useState, useContext } from "react";
import "react-popupbox/dist/react-popupbox.css"
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import * as FormPost from '../FormPost.js'
import {usePosition} from '../usePosition';
import PropTypes from 'prop-types';
import './form-style.css'

function FormCli(params, watch, settings){

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

    const submitForm = (e, props) => {
        e.preventDefault()
        let newItem = {
            project_id:   params.id,
            date:         date + " " + time,
            title:        title,
            notes:        notes,
            measurements: {
                "Temperature (F)":   temperature,
                "Wind Speed (m/s)":     windSpeed,
                "Precipitation (mm)": precipitation
            },
            latitude:     lat,
            longitude:    long
        }
        FormPost.post(newItem)
        window.location.replace('/observations?pid=' + params.id)
    }

    return (
        <div>
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
                defaultValue={latitude}
                onChange={e => setLat(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Longitude"
                type="text"
                name={longitude}
                defaultValue={longitude}
                onChange={e => setLong(e.target.value)}
                required
                />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

FormCli.propTypes = {
    watch: PropTypes.bool,
    settings: PropTypes.object,
};

export default FormCli
