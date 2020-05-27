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
                        {Array.isArray(projects) && projects.map((projects) => (
                            <Card key={projects.pid}>
                                <Card.Img variant="top" src={projects.images[0].file_path + projects.images[0].file_name + projects.images[0].file_type} alt="Image not found" onError={(e)=>{e.target.onerror = console.log(e); e.target.src="/images/no_image.jpg"}} />
                                <Card.Body>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        <Card.Title>{projects.title}</Card.Title>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Text>{projects.description}</Card.Text>
                                    </Accordion.Collapse>
                                </Card.Body>
                                <Card.Footer>
                                    <Link to={{
                                        pathname: '/project', search: '?pid=' + projects.pid
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
