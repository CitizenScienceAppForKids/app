import React, { useEffect, useState } from "react";
import Pcards from '../components/Pcards'

function Projects(){
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        await fetch('http://cab-cs467.net:80/api/projects', {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Host": "localhost",
                "Origin": "cab-cs467.net"
            },
        })
        .then((r) => r.json())
        .then((response) => setData(response));
    };

    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <Pcards projects = {data} />
    )
}

export default Projects;
