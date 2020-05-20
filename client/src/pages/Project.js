import React, { useEffect, useState } from "react";
import Pview from '../components/Pview';
import * as QueryString from "query-string";
import { envEndpointOrigin } from "../components/EnvHelpers.js"

function Project(props){
    const params = QueryString.parse(props.location.search);
    const [data, setData] = useState([]);
    const [endpoint, origin] = envEndpointOrigin('api/projects/') 
    const fetchApi = async () => {
        await fetch(endpoint + params.pid, {
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
            <Pview project = {data} />
        </div>
    )
}

export default Project;
