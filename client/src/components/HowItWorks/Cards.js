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
                        <ProcessCard imgsrc={img1} title="View A Project" body="We have assembled three projects to choose
                        from covering a range of scientific topics that you can help contribute to."/>
                    </div>
                    <div className='col-md-4'>
                        <ProcessCard imgsrc={img2} title="Record Your Observations" body="Each project has a specific
                        type of observation. Choose a project to get started."/>
                    </div>
                    <div className='col-md-4'>
                        <ProcessCard imgsrc={img3} title="Collaborate" body="By participating in Citizen Science, you
                        become a collaborator with other citizen scientists and help further scientific endeavors."/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cards;