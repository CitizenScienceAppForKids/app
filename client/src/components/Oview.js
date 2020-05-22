import React from 'react'

const Oview = ({ observation }) => {

    return (
        <div>
            {observation.map((observation) => (
                <div key={observation.oid}>
                    <h2>{observation.title}</h2>
                    <p>{observation.notes}</p>
                    {Object.keys(JSON.parse(observation.measurements)).map((keyName, i) => (
                        <p key={i}>
                            {keyName}: {JSON.parse(observation.measurements)[keyName]}
                        </p>
                    ))}
                    <p>{observation.latitude}</p>
                    <p>{observation.longitude}</p>

                </div>
            ))}
        </div>
    )
};

export default Oview