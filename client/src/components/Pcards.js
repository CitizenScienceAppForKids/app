import React from 'react'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import { Accordion, Button } from 'react-bootstrap'
import { Link } from "react-router-dom";

const Pcards = ({ projects }) => {

    return (
        <container>
            <div>
                <Accordion>
                    <CardColumns>
                        {Array.isArray(projects) && projects.map((project, index) => (
                            <Card key={project.pid}>
                                <Card.Img variant="top" src={"http://localhost:8000" + project.images[0].file_path + project.images[0].file_name + project.images[0].file_type} alt="Image not found" onError={(e)=>{e.target.onerror = null; e.target.src="/images/no_image.jpg"}} />
                                <Card.Body>
                                    <Accordion.Toggle as={Button} variant="link" eventKey={index}>
                                        {project.title}
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={index}>
                                        <Card.Text>{project.description}</Card.Text>
                                    </Accordion.Collapse>
                                </Card.Body>
                                <Card.Footer>
                                    <Link to={{
                                        pathname: '/project', search: '?pid=' + project.pid
                                    }}>View Project</Link>
                                </Card.Footer>
                            </Card>
                        ))}
                    </CardColumns>
                </Accordion>
            </div>
        </container>
    )
};

export default Pcards
