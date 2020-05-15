import React from 'react'
import { Link } from "react-router-dom";

const Pview = ({ project }) => {

    return (
        <div>
            {project.map((project) => (
                <div key={project.pid}>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <Link to={{
                                pathname: '/observations', search: '?pid=' + project.pid
                    }}>View Observations</Link>
                    <br></br>
                    <Link to={{
                                pathname: '/newobservation', search: '?pid=' + project.pid
                    }}>Make Observation</Link>

                </div>
                
                
            ))}
        </div>
    )
};

export default Pview