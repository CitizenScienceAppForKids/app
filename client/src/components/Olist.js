import React from 'react'
import Table from 'react-bootstrap/Table'
import { Link } from "react-router-dom";

const Olist = ({ observations }) => {

    return (
        <Table responsive>
            <thead>
                <tr>
                <th>#</th>
                <th>Date</th>
                <th>Title</th>
                <th>Latitude</th>
                <th>Longitude</th>
                </tr>
            </thead>
            <tbody>
                {observations.map((observations) => (
                    
                        <tr key={observations.oid}>
                            <td>{observations.oid}</td>
                            <td>{observations.date}</td>
                            <td>{observations.title}</td>
                            <td>{observations.longitude}</td>
                            <td>{observations.latitude}</td>
                        </tr>
                    
                ))}
            </tbody>
        </Table>
    )
};

export default Olist