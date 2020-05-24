import React, { Component } from 'react'
import ProcessCard from './HowItWorks';
import img1 from '../../assets/images/biodiversity.png';
import img2 from '../../assets/images/climatechange.png';
import img3 from '../../assets/images/species.png';

class Cards extends Component {
    render() {
        return (
            <div className='container-fluid d-flex justify-content-center'>
                <div className='row'>
                    <div className='col-md-4'>
                        <ProcessCard imgsrc={img1} title="View A Project"/>
                    </div>
                    <div className='col-md-4'>
                        <ProcessCard imgsrc={img2} title="Record Your Observations"/>
                    </div>
                    <div className='col-md-4'>
                        <ProcessCard imgsrc={img3} title="Collaborate"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cards;