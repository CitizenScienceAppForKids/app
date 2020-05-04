import React, { useEffect, useState } from "react";

function Home(){
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        await fetch("http://cab-cs467.net:80/api/projects", {
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
