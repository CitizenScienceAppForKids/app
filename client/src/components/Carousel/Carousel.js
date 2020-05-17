import React from 'react';
import { Carousel } from 'react-responsive-carousel';

class CarouselComponent extends React.Component {
    render() {
        return (
            <div className="carousel-container">
                <Carousel autoPlay>
                    <div>
                        <img alt="" src="http://placehold.it/100x50" />
                        <p className="legend">Carousel 1</p>
                    </div>
                    <div>
                        <img alt="" src="http://placehold.it/100x50" />
                        <p className="legend">Carousel 2</p>
                    </div>
                </Carousel>
            </div>
        );
    }
}

export default CarouselComponent;

//
// const Carousel = () => {
//     <Carousel>
//       <Carousel.Item>
//         <img
//           className="d-block w-100"
//           src="holder.js/800x400?text=First slide&bg=373940"
//           alt="First slide"
//         />
//         <Carousel.Caption>
//           <h3>First slide label</h3>
//           <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
//         </Carousel.Caption>
//       </Carousel.Item>
//       <Carousel.Item>
//         <img
//           className="d-block w-100"
//           src="holder.js/800x400?text=Second slide&bg=282c34"
//           alt="Third slide"
//         />
//
//         <Carousel.Caption>
//           <h3>Second slide label</h3>
//           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
//         </Carousel.Caption>
//       </Carousel.Item>
//       <Carousel.Item>
//         <img
//           className="d-block w-100"
//           src="holder.js/800x400?text=Third slide&bg=20232a"
//           alt="Third slide"
//         />
//
//         <Carousel.Caption>
//           <h3>Third slide label</h3>
//           <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
//         </Carousel.Caption>
//       </Carousel.Item>
//     </Carousel>
// }
//
//
//
// export default Carousel;