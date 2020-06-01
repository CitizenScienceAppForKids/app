import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import Map from './Map'
import { envEndpointOrigin } from './EnvHelpers.js'
import CardColumns from 'react-bootstrap/CardColumns'

const Pview = (project) => {

    const [endpoint, origin] = envEndpointOrigin('api/projects/' + project.id + '/observations')
    const [data, setData] = useState([]);
    const fetchApi = async () => {

        await fetch(endpoint, {
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

            <div key={project.pid}>
                <Card className="bg-dark text-white">
                    
                    <Card.Img src={"http://localhost:8000" + project.image.file_path + project.image.file_name + "2" + project.image.file_type} width="100%" alt="Card image" />
                    <Card.ImgOverlay>
                        <Card.Title>{project.title}</Card.Title>
                    </Card.ImgOverlay>
                </Card>

                <CardColumns style={{backgroundColor: 'white'}}>
                    <div>
                        <div>
                            <Card style={{padding: '40px', border: 'none', margin: 'auto'}}>
                                {project.description}
                            </Card>
                        </div>
                        <div>
                            <Card style={{padding: '40px', textAlign: 'center', border: 'none', margin: 'auto'}}>
                                <h3 style={{color: '#FF00E2'}}>Observations</h3>
                                <Card.Text style={{fontSize: '80px'}}>{data.length}</Card.Text>
            
                                <span style={{color: '#B2009E', textAlign: 'center'}}>
                                    <Link style={{color: '#B2009E', paddingRight: '10px'}} to={{ pathname: '/observations', search: '?pid=' + project.pid }}>View All</Link>
                                    |
                                    <Link style={{color: '#B2009E', paddingLeft: '10px'}} to={"/newobservation?pid=" + project.pid + "&type=" + project.type}>
                                        <span style={{paddingRight: '10px'}}>Add</span><img src={"./images/add.png"} width="25px" height="25px" alt="Card image" />
                                    </Link>
                                </span>
                            </Card>
                        </div>
                        <div>
                            <Card  style={{border: 'none'}}>
                                <div style={{ flexGrow: '1', paddingRight: '40px', paddingLeft: '40px'}}>
                                    <Map pMap = {data} />
                                </div>
                            </Card>
                        </div>
                    </div>
                </CardColumns>
            </div>
        ))}
        </div>
    )
};

export default Pview