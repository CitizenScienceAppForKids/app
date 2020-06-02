import React, { useEffect, useState } from "react";
import Pview from '../components/Pview';
import * as QueryString from "query-string";
import { envEndpointOrigin } from "../components/EnvHelpers.js"

function Project(props){
    const params = QueryString.parse(props.location.search);
    const [data, setData] = useState([]);
    const [endpoint, origin] = envEndpointOrigin(`api/projects/${params.pid}`) 
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
<<<<<<< HEAD
=======
         // console.log(params)
>>>>>>> 041db99c7448c588a6201081457e3420cca50ee7
    }, [params.pid]);

    return (
        <div>
            <Pview  id = {params.pid} project = {data}/>
        </div>
    )
}

export default Project;
