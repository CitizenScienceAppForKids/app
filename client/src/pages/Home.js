import React, { useEffect, useState } from "react";

function Home(){
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        await fetch("http://localhost:8080/api/projects", {
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
    }, []);

    return (
        <div>
            {data.map(data => ( 
                <div key={data.title}>
                    <h3>{data.title}</h3>
                    <div>{data.date}</div>
                    <div>{data.notes}</div>
                </div>
            ))}
        </div>
    )
}

export default Home;
