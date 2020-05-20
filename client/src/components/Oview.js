import React from 'react'

const Oview = ({ observation }) => {

    return (
        <div>
            {observation.map((observation) => (
                <div key={observation.oid}>
                    <h2>{observation.title}</h2>
                    <p>{observation.notes}</p>
                    <p>{observation.measurements}</p>
                    <p>{observation.latitude}</p>
                    <p>{observation.longitude}</p>

                </div>
            ))}
        </div>
    )
};

export default Oview