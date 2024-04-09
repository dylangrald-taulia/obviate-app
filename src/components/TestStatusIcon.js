import React from 'react';

function TestStatusIcon({testRequest}) {
    const uuId = testRequest.uuId;
    const loading = testRequest.loading;
    const fileName = testRequest.fileName;

    if (!uuId) return null;
    
    let icon = null;
    if (loading) {
        icon = <div>
            <p>Test for {fileName} is being created...</p>
        </div>
    } else {
        icon = <div>
            <p>Test for {fileName} has been created!</p>
        </div>
    }
    return icon;
}

export default TestStatusIcon;