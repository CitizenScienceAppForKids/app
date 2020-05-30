import React, { useEffect, useState } from "react";
import Oview from '../components/Oview'
import * as QueryString from "query-string";
import { envEndpointOrigin } from "../components/EnvHelpers.js"

function Observation(oid){
    

    const [data, setData] = useState([]);
    const [endpoint, origin] = envEndpointOrigin('api/observations/') 
    const fetchApi = async () => {
        await fetch(endpoint + oid.obs, {
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
    }, [oid]);

    return (
        <div>
            <Oview observation = {data} />
        </div>
    )
}

export default Observation;
