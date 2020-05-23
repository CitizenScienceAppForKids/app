import React, { useEffect, useState } from "react";
import Olist from '../components/Olist';
import * as QueryString from "query-string";
import { envEndpointOrigin } from "../components/EnvFetchHelpers.js"

function Observations(props){
    const params = QueryString.parse(props.location.search);
    const [data, setData] = useState([]);
    const [endpoint, origin] = envEndpointOrigin('api/projects/') 
    const fetchApi = async () => {
        await fetch(endpoint + params.pid + '/observations', {
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
    }, [params.pid]);

    return (
        <div>
            <Olist observations = {data} />
        </div>
    )
}

export default Observations;
