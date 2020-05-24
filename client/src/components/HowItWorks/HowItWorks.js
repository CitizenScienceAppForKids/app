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
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
                    </p>
                    <a href='/projects' className="btn btn-outline-success">Learn More</a>
            </div>
        </div>
    );
};

export default ProcessCard;














//
// function ProcessCard() {
//     return (
//         <CardDeck>
//           <Card>
//             <Card.Img variant="top" src="" />
//             <Card.Body>
//               <Card.Title>View A Project</Card.Title>
//               <Card.Text>
//                 This is a wider card with supporting text below as a natural lead-in to
//                 additional content. This content is a little bit longer.
//               </Card.Text>
//             </Card.Body>
//             <Card.Footer>
//               <small className="text-muted">Last updated 3 mins ago</small>
//             </Card.Footer>
//           </Card>
//           <Card>
//             <Card.Img variant="top" src="" />
//             <Card.Body>
//               <Card.Title>Record Your Observations</Card.Title>
//               <Card.Text>
//                 This card has supporting text below as a natural lead-in to additional
//                 content.{' '}
//               </Card.Text>
//             </Card.Body>
//             <Card.Footer>
//               <small className="text-muted">Last updated 3 mins ago</small>
//             </Card.Footer>
//           </Card>
//           <Card>
//             <Card.Img variant="top" src="" />
//             <Card.Body>
//               <Card.Title>View Other Observations</Card.Title>
//               <Card.Text>
//                 This is a wider card with supporting text below as a natural lead-in to
//                 additional content. This card has even longer content than the first to
//                 show that equal height action.
//               </Card.Text>
//             </Card.Body>
//             <Card.Footer>
//               <small className="text-muted">Last updated 3 mins ago</small>
//             </Card.Footer>
//           </Card>
//         </CardDeck>
//     )
//
// };



