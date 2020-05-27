import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import firefly from '../../assets/images/icon_firefly.png'
import leafdrop from '../../assets/images/icon_leafdrop.png'
import monarch from '../../assets/images/icon_monarch.png'
import nestwatch from '../../assets/images/icon_nestwatch.png'
import salamander from '../../assets/images/icon_salamanderwatch.png'
import './carousel-style.css';

class CarouselComponent extends React.Component {
    render() {
        return (
            <div className="carousel-container">
                <Carousel autoPlay>
                    <Carousel.Item>
                        <img alt="ff" src={firefly}/>
                        <Carousel.Caption>
                            <p className="legend">Firefly Watch</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img alt="ld" src={leafdrop} />
                        <Carousel.Caption>
                            <p className="legend">Leaf Drop</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img alt="m" src={monarch} />
                        <Carousel.Caption>
                            <p className="legend">Monarch Butterflies</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img alt="nw" src={nestwatch} />
                        <Carousel.Caption>
                            <p className="legend">Neighborhood Nestwatch</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img alt="s" src={salamander} />
                        <Carousel.Caption>
                            <p className="legend">Salamander Watch</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        );
    }
}

export default CarouselComponent;

