import React, { useEffect, useState } from "react";
import history from '../components/history';
import CarouselComponent from "../components/Carousel/Carousel";
import './Home.css';
import { envEndpointOrigin } from "../components/EnvHelpers.js"
import Card from '../components/HowItWorks/Cards';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Logo from '../components/Logo/Logo'
import About from '../components/About/About';

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

    const [faqs, setfaqs] = useState([
        {
            question: 'What is Citizen Science For Kids?',
            answer: 'People of all ages can be citizen scientists! All that is needed is some curiousity.',
            open: true
        },
        {
            question: 'Who can be involved in scientific research?',
            answer: 'Anyone can be involved in scientic research through citizen Science!',
            open: false
        },
        {
            question: 'What is Citizen Science?',
            answer: 'Citizen Science occurs when regular citizens get involved in science.',
            open: false
        },
        {
            question: 'How can I get involved?',
            answer: 'View the open projects and record your observations!',
            open: false
        }
    ]);

    const toggleAbout = index => {
        setfaqs(faqs.map((faq, i) => {
            if (i === index) {
                faq.open = !faq.open
            } else {
                faq.open = false;
            }

            return faq;
        }))
    }

    return (
        <div class="flexbox-container">
            <Logo />
            <h1 class='tc'>{'Citizen Science for Kids!'}</h1>
            <div className='tc'>
                    <button onClick={() => history.push('/projects')} className='w-30 grow f4 link ph3 pv2 dib white bg-light-green center'>View Projects</button>
            </div>
                <Card />
            <div className="faqs">
                {faqs.map((faq, i) => (
                    <About faq={faq} index={i} toggleAbout={toggleAbout} />
                ))}
            </div>
        </div>
    );
}


export default Home;
