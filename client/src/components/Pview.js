import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import Map from './Map'

const Pview = (project) => {

    console.log(project.images)

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
                <Card key={project.pid} className="bg-dark text-white">
                    
                    <Card.Img src={"http://localhost:8000" + project.image.file_path + project.image.file_name + "2" + project.image.file_type} width="100%" alt="Card image" />
                    <Card.ImgOverlay>
                        <Card.Title>{project.title}</Card.Title>
                    </Card.ImgOverlay>
                </Card>

                <Card key={project.pid}>

                    <div style={{display: 'flex', alignItems: 'stretch'}}>
                        <Card style={{flex: '1 1 0px', padding: '40px', border: 'none', margin: 'auto'}}>
                            {project.description}
                        </Card>

                        <Card style={{flex: '1 1 0px', padding: '40px', textAlign: 'center', border: 'none', margin: 'auto'}}>
                            <h3 style={{color: '#FF00E2'}}>Observations</h3>
                            <Card.Text style={{fontSize: '80px'}}>{data.length}</Card.Text>
                            <div style={{display: 'flex', fontSize: '20px', margin: 'auto'}}>
                                <Link style={{color: '#B2009E', paddingRight: '10px'}} to={{ pathname: '/observations', search: '?pid=' + project.pid }}>View All</Link>
                                <span style={{color: '#B2009E'}}>|</span>
                                <Link style={{color: '#B2009E', paddingLeft: '10px'}} to={"/newobservation?pid=" + project.pid + "&type=" + project.type}>
                                    <span style={{paddingRight: '10px'}}>Add</span><img src={"./images/add.png"} width="25px" height="25px" alt="Card image" />
                                </Link>
                            </div>
                        </Card>

                        <Card  style={{flex: '1 1 0px', padding: '40px', border: 'none'}}>
                            <div style={{ flexGrow: '1', paddingRight: '40px', paddingLeft: '40px'}}>
                                <Map pMap = {data} />
                            </div>
                        </Card>
                    </div>

                </Card>
            </div>
        ))}
        </div>
    )
};

export default Pview