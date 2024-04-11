import React from 'react';
import '../App.css';

function TestStatusIcon({testRequest}) {

    if (Object.keys(testRequest).length === 0) return null

    const icons = Object.keys(testRequest).map((key) => {
        if (testRequest[key].status === 'loading') {
            return (
                <div key={key} className='test-request-icon'>
                    <span className='icon-orange'>{`Generating test for ${testRequest[key].fileName}`}</span>
                </div>
            )
        } else if (testRequest[key].status === 'ready') {
            return (
                <div key={key} className='test-request-icon'>
                    <span className='icon-green'>{`Test for ${testRequest[key].fileName} is ready`}</span>
                </div>
            )
        } else {
            return (
                <div key={key} className='test-request-icon'>
                    <span className='icon-red'>{`Error generating test for ${testRequest[key].fileName}`}</span>
                </div>
            )
        }
    })

    return (
        <div className='test-request-icons-div'>
            <h2>Test Queue:</h2>
            {icons}
        </div>
    )
}

export default TestStatusIcon;