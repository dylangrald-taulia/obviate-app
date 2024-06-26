import React from 'react';
import '../App.css';

function TestStatusIcon({testRequest}) {
  
  if (Object.keys(testRequest).length === 0) return null

    const handleSaveFile = (codeToSave, fileName) => {
        if(!codeToSave) {
            window.alert('File is not available yet. Please wait for the test to finish.');
            return
        }
        // Create a Blob containing the text
        const blob = new Blob([codeToSave], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Create an anchor element
        const a = document.createElement('a');
        a.href = url;
        const parts = fileName.split('.');
        a.download = parts.slice(0, parts.length - 1) + 'Test.' + parts[parts.length - 1]; // Set the file name
        document.body.appendChild(a);

        // Trigger a click event on the anchor element
        a.click();

        // Cleanup
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

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
                  <div className='column'><span className='icon-green'>{`Test for ${testRequest[key].fileName} is ready`}</span></div>
                  <div className='column'><button onClick={() => handleSaveFile(testRequest[key].response, testRequest[key].fileName)}>Download File</button></div>
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