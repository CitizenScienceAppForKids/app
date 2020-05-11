import React from 'react'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'

const Pcards = ({ projects }) => {

    return (
        <div>
            <CardColumns>
                {Array.isArray(projects) && projects.map((projects) => (
                    <Card key={projects.pid}>
                        <Card.Img variant="top" src={"http://localhost:8000" + projects.images[0].file_path + projects.images[0].file_name + projects.images[0].file_type} alt="Image not found" onError={(e)=>{e.target.onerror = null; e.target.src="/images/no_image.jpg"}} />
                        <Card.Body>
                            <Card.Title>{projects.title}</Card.Title>
                            <Card.Text>
                            {projects.description}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                ))}
            </CardColumns>
        </div>
    )
};

export default Pcards
