import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Image from 'react-image-resizer';
import Observation from '../pages/Observation';
import '../index.css';
import "react-popupbox/dist/react-popupbox.css"
import {
  PopupboxManager,
  PopupboxContainer
} from 'react-popupbox';

const Olist = ({ observations }) => {

    const popupboxConfig = {
        titleBar: {
          enable: true,
          text: 'Observation'
        },
        fadeIn: true,
        fadeInSpeed: 500
      }


    function openPopupbox(value) {
        const content = (
          <div>
            <Observation obs = {value} />
          </div>
        )
        PopupboxManager.open({ content })
    }

    return (
        <div>


        <ListGroup>
        {observations.map((observations) => (
            <ListGroupItem key={observations.oid}>
                <Card>
                    <Card.Header>{observations.title} 
                        <Button value={observations.oid} onClick={(e) => openPopupbox(e.target.value)} size="sm" style={{float: 'right', backgroundColor: '#17a2b8', borderColor: '#17a2b8'}}>View</Button>
                    </Card.Header>
                        
                    <Card.Body>
                        <Card.Title style={{color: '#17a2b8'}}>{observations.date}</Card.Title>
                        <Card.Text>{observations.notes}</Card.Text>
                        <div style={{display: 'flex'}}>
                            {observations.images.map((image) => (
                            <ListGroup key={image.iid}>
                                <ListGroup.Item style={{border: 'none', padding: 5}}>
                                
                                    <Image src={image.file_path + image.file_name + image.file_type} width={50} height={50}/>

                                </ListGroup.Item>
                            </ListGroup>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </ListGroupItem>
        ))}
        </ListGroup>
        <PopupboxContainer {...popupboxConfig } />
        </div>
    )

};

export default Olist
