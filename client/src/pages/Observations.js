import React, { useEffect, useState } from "react";
import Olist from '../components/Olist';
import * as QueryString from "query-string";

function Observations(props){
    const params = QueryString.parse(props.location.search);
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        await fetch('http://localhost:5000/api/projects/' + params.pid + '/observations', {
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
    }, [params.pid]);

    return (
        <div>
            <Olist observations = {data} />
        </div>
    )
}

export default Observations;