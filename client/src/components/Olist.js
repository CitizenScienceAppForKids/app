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

//  Code taken from component documentation at:  
//  https://www.npmjs.com/package/react-popupbox
//  https://fraina.github.io/react-popupbox/
//
//  Credit these site for significant portions of this code


const Olist = ({ observations }) => {

    const popupboxConfig = {
        titleBar: {
          enable: true,
          text: 'observation'
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
                    <Card.Header style={{color: '#B2009E'}}>{observations.title} 
                        <Button value={observations.oid} onClick={(e) => openPopupbox(e.target.value)} size="sm" style={{float: 'right', backgroundColor: '#B2009E', borderColor: '#FF00E2'}}>View</Button>
                    </Card.Header>
                    <Card.Body>
                        <p style={{color: '#FF00E2'}}>{observations.date} </p>
                        <Card.Text>{observations.notes}</Card.Text>
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