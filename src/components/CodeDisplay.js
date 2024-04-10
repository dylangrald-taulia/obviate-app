import React, { useState } from 'react';
import '../App.css';

function CodeDisplay({testResults, setTestResults}) {

    useState(() => {
        setTestResults(testResults.concat({
            fileName: 'SubtractionCalculatorSpec.groovy',
            code: "\npackage com.taulia.partnerIntegration.core.v1\n\nimport spock.lang.*\nimport static org.junit.Assert.*\n\nclass SubtractionCalculatorSpec extends Specification {\n\ndef \"subtractTwoNumbers returns the correct result\"() {\n    given:\n        def calculator = new SubtractionCalculator()\n    when:\n        def result = calculator.subtractTwoNumbers(a, b)\n    then:\n        result == expectedResult\n    where:\n        a | b || expectedResult\n        5 | 3 || 2\n        10 | 5 || 5\n}\n",
            uuId: '12345',
        }))
    }, [])

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