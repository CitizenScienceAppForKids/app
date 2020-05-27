import React, { useEffect, useState } from "react";
import history from '../components/history';
import CarouselComponent from "../components/Carousel/Carousel";
import './Home.css';
import Card from '../components/HowItWorks/Cards';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    gridContainer: {
        paddingLeft: "40px",
        paddingRight: "40px"
    }
});

function Home(){
    const classes = useStyles();
	const endpoint = (process.env.NODE_ENV === "production") ? "https://cab-cs467.net:443/api/projects" : "http://localhost:5000/api/projects"
	const origin   = (process.env.NODE_ENV === "production") ? "cab-cs467.net" : "localhost"
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