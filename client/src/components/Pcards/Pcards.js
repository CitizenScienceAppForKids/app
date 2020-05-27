import React from 'react'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import { Accordion, Button } from 'react-bootstrap'
import { Link } from "react-router-dom";
import './card-style.css';

const Pcards = ({ projects }) => {

    return (
        <container>
            <div className='Cards text-center'>
                <Accordion>
                    <CardColumns>
                        {Array.isArray(projects) && projects.map((project, index) => (
                            <Card key={project.pid}>
                                <div className='overflow'>
                                    <Card.Img className="Cards-img-top" variant="top" src={"http://localhost:8000" + project.images[0].file_path + project.images[0].file_name + project.images[0].file_type} alt="Image not found" onError={(e)=>{e.target.onerror = null; e.target.src="/images/no_image.jpg"}} />
                                </div>
                                <div className='Cards-body text-dark'>
                                    <Card.Body>
                                        <Accordion.Toggle as={Button} variant="link" eventKey={index} className='Cards-title'>
                                            {project.title}
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={index} className='Cards-text'>
                                            <Card.Text>{project.description}</Card.Text>
                                        </Accordion.Collapse>
                                    </Card.Body>
                                </div>
                                <Card className='btn btn-outline-success'>
                                    <Link to={{
                                        pathname: '/project', search: '?pid=' + project.pid
                                    }}>View Project</Link>
                                </Card>
                            </Card>
                        ))}
                    </CardColumns>
                </Accordion>
            </div>
        </container>
    )
};

export default Pcards
