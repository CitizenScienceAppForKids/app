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
            Home - Give an intro to the website (ie logo and description), along with a "view projects" button
        </div>
    )
}

export default Home;