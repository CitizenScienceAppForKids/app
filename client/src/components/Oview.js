import React from 'react'
import Card from 'react-bootstrap/Card'
import Image from 'react-image-resizer';
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'

const Oview = ({ observation }) => {

    return (
        <div>
            {observation.map((observation) => (
                <div key={observation.oid}>
                    <Card>
                        <Card.Header>
                            <h3 style={{color: '#B2009E'}}>{observation.title}</h3>
                        </Card.Header>
                        <Card.Body>
                            <p style={{color: '#FF00E2'}}>{observation.date}</p>
                            <p>{observation.notes}</p>
                            <div style={{width: '100%'}}>
                                <p style={{textAlign: 'right', color: '#FF00E2'}}> {observation.longitude} {observation.latitude}</p>
                            </div>
                            <hr />
                            <h5 style={{color: '#B2009E'}}> Measurements </h5>
                            <hr />
                            
                            {Object.keys(JSON.parse(observation.measurements)).map((keyName, i) => (
                                <table key={i}> 
                                <tr>
                                    <td style={{width: '100px'}}>
                                        <b style={{paddingLeft: '25px', color: '#FF00E2'}}>{keyName}:</b>
                                    </td>
                                    <td>
                                        {JSON.parse(observation.measurements)[keyName]}
                                    </td>
                                </tr>
                           </table>
                            ))}
                            <hr />
                            <h5 style={{color: '#B2009E'}}> Images </h5>
                            <hr />
                            <div style={{display: 'flex'}}>
                            {observation.images.map((images) => (
                            <ListGroup key={images.iid}>
                                <ListGroup.Item style={{border: 'none', padding: 5}}>
                                
                                    <Image src={images.file_path + images.file_name + images.file_type} width={200} height={200}/>

                                </ListGroup.Item>
                            </ListGroup>
                            ))}
                        </div>
                        </Card.Body>
                    

                    </Card>

                </div>
            ))}
        </div>
    )
};

export default Oview