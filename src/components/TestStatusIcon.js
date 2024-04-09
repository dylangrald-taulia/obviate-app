import React from 'react';

function TestStatusIcon({testRequest}) {
    if (testRequest.length === 0) return null

    const icons = testRequest.map((test) => {
        if (test.status === 'loading') {
            return (
                <div key={test.uuId}>
                    <span>{`Generating test for ${test.fileName}`}</span>
                </div>
            )
        } else {
            return null
        }
    })

    return (
        <div>
            {icons}
        </div>
    )
}

export default TestStatusIcon;