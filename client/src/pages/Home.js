import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import history from '../components/history';
import CarouselComponent from "../components/Carousel/Carousel";
import './Home.css';
import { envEndpointOrigin } from "../components/EnvHelpers.js"

function Home(){
    const [endpoint, origin] = envEndpointOrigin('api/projects') 
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        await fetch(endpoint, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Host": "localhost",
                "Origin": origin
            },
        })
        .then((r) => r.json())
        .then((response) => setData(response));
    };

    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <div>
            <h1 class='tc'>{'Citizen Science for Kids!'}</h1>
            <div className='tc'>
                    <button onClick={() => history.push('/projects')} className='w-30 grow f4 link ph3 pv2 dib white bg-light-green center'>View Projects</button>
            </div>
            <br/>
            <CarouselComponent />
        </div>
        );
}


export default Home;
