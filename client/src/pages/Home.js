import React, { useEffect, useState } from "react";
import history from '../components/history';
import CarouselComponent from "../components/Carousel/Carousel";
import './Home.css';
import { envEndpointOrigin } from "../components/EnvHelpers.js"
import Card from '../components/HowItWorks/Cards';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Logo from '../components/Logo/Logo'

const useStyles = makeStyles({
    gridContainer: {
        paddingLeft: "40px",
        paddingRight: "40px"
    }
});

function Home(){
    const classes = useStyles();
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
        <div class="flexbox-container">
            <Logo />
            <h1 class='tc'>{'Citizen Science for Kids!'}</h1>
            <div className='tc'>
                    <button onClick={() => history.push('/projects')} className='w-30 grow f4 link ph3 pv2 dib white bg-light-green center'>View Projects</button>
            </div>
            <br/>
            <div className='cc'>
                <CarouselComponent />
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
                <Card />
        </div>
    );
}


export default Home;
