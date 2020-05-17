import React, { useEffect, useState } from "react";
import Oview from '../components/Oview'
import * as QueryString from "query-string";

function Observation(oid){
    console.log(oid)
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        await fetch('http://localhost:5000/api/observations/' + oid.obs, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000"
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