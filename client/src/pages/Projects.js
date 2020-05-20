import React, { useEffect, useState } from "react";
import Pcards from "../components/Pcards"
import { envEndpointOrigin } from "../components/EnvHelpers.js"

function Projects(){
    const [data, setData] = useState([]);
    const [endpoint, origin] = envEndpointOrigin('api/projects') 
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
            <Pcards projects = {data} />
        </div>
    )
}

export default Projects;
