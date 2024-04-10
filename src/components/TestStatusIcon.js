import React, {useEffect, useState} from 'react';
import '../App.css';

function TestStatusIcon({testRequest, setTestRequest}) {

    // remove this
    // useEffect(() => {
    //     setTestRequest({...testRequest, '123456': {
    //         fileName: 'LoadingTestIcon.groovy',
    //         status: 'loading',
    //         tried: false,
    //     },
    //     '123457': {
    //         fileName: 'ReadyTestIcon.groovy',
    //         status: 'ready',
    //         tried: true,
    //     },
    //     '123458': {
    //         fileName: 'ErrorTestIcon.groovy',
    //         status: 'error',
    //         tried: true,
    //     }})
    // }, [])

    if (testRequest.length === 0) return null

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