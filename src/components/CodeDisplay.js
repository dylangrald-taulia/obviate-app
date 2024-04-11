import React from 'react';
import '../App.css';

function CodeDisplay({testResults}) {

    if (testResults.length === 0) return null
    
    
    const codeDisplays = testResults.map((test) => {
        return (
            <div key={test.uuId} className='single-result-div'>
                <h3>{test.fileName}</h3>
                <pre><code>{test.code}</code></pre>
            </div>
        )
    })

    return (
        <div className='results-div'>
            <h2>Results:</h2>
            {codeDisplays}
        </div>
    )
}

export default CodeDisplay;