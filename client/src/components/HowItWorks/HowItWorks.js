import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import CardDeck from "react-bootstrap/CardDeck";
import './card-style.css';

const ProcessCard = props => {
    return(
        <div className="cards text-center shadow">
            <div className="overflow">
                <img src={props.imgsrc} alt='bug' className="cards-img-bot" />
            </div>
            <div className="cards-body text-dark">
                <h4 className="cards-title"> {props.title} </h4>
                    <p className="cards-text text-secondary">
                    { props.body }
                    </p>
                    <a href='/projects' className="btn btn-outline-success">Learn More</a>
            </div>
        </div>
    );
};

export default ProcessCard;

















