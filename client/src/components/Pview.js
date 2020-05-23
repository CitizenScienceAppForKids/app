import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import Map from './Map'

const Pview = (project) => {

    const [data, setData] = useState([]);
    const fetchApi = async () => {

        await fetch('http://localhost:5000/api/projects/' + project.id + '/observations', {
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
    }, [project.id]);

    return (
        <div>
        {project.project.map((project) => (
            <div>
                <Card key={project.pid}>
                    <Card.Header >
                        {project.title}
                        <span style={{float: 'right', color: '#17a2b8'}}>{project.type}</span>
                    </Card.Header>
                    <Card.Body>
                        <div style={{display: 'flex'}}>
                            <div style={{flexGrow: '1'}}>
                                <Card.Img variant="top" src={project.image.file_path + "/" + project.image.file_name + "." + project.image.file_type} alt="Image not found" onError={(e)=>{e.target.onerror = null; e.target.src="/images/no_image.jpg"}} />
                            </div>

                            <div style={{flexGrow: '2', paddingRight: '40px', paddingLeft: '40px'}}>
                                <Card.Text style={{clear: 'both'}}>{project.description}</Card.Text>
                            </div>

                            <div style={{flexGrow: '1', textAlign: 'center', padding: '20px'}}>
                            <Link to={{
                                        pathname: '/observations', search: '?pid=' + project.pid
                            }}>
                                <h4 style={{color: '#17a2b8'}}>Observations</h4>
                            </Link>
                            <Card.Text style={{fontSize: '80px'}}>{data.length}</Card.Text>
                            </div>
                        </div>

                        <Link to={"/newobservation?pid=" + project.pid + "&type=" + project.type} >Create New Observation</Link>
                        <div style={{display: 'flex'}}>
                            <div style={{flexGrow: '1', textAlign: 'center', padding: '20px', marginLeft: '25%', marginRight: '25%'}}>
                                <Map pMap = {data} />
                            </div>
                        </div>

                    </Card.Body>
                </Card>
            </div>
        ))}
        </div>
    )
};

export default Pview
