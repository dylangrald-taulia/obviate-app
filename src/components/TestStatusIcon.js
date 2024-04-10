import React, {useEffect, useState} from 'react';
import '../App.css';

function TestStatusIcon({testRequest, setTestRequest}) {

    // remove this
    useEffect(() => {
        setTestRequest([...testRequest, {
            fileName: 'LoadingTestIcon.groovy',
            status: 'loading',
            uuId: '123456',
        },
        {
            fileName: 'ReadyTestIcon.groovy',
            status: 'ready',
            uuId: '123457',
        },
        {
            fileName: 'ErrorTestIcon.groovy',
            status: 'error',
            uuId: '123458',
        }])
    }, [])

    if (testRequest.length === 0) return null

    const icons = testRequest.map((test) => {
        if (test.status === 'loading') {
            return (
                <div key={test.uuId} className='test-request-icon'>
                    <span className='icon-orange'>{`Generating test for ${test.fileName}`}</span>
                </div>
            )
        } else if (test.status === 'ready') {
            return (
                <div key={test.uuId} className='test-request-icon'>
                    <span className='icon-green'>{`Test for ${test.fileName} is ready`}</span>
                </div>
            )
        } else {
            return (
                <div key={test.uuId} className='test-request-icon'>
                    <span className='icon-red'>{`Error generating test for ${test.fileName}`}</span>
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