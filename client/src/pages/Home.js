import React, { useEffect, useState } from "react";

function Home(){
	const endpoint = (process.env.NODE_ENV === "production") ? "https://cab-cs467.net:443/api/projects" : "http://localhost:5000/api/projects"
	const origin   = (process.env.NODE_ENV === "production") ? "cab-cs467.net" : "localhost"
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
