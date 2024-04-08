import React, { useState } from 'react';
import axios from 'axios';

function TestForm() {
    const [testType, setTestType] = useState('');
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');

    const url = '//localhost:8000/create-prompt-async/'

    React.useEffect(() => {
        if (file) {
            setFileName(file.name);
            readFile(file);
        }
    }, [file]);

    const testTypeOptions = ['unit']

    const testTypeRadioButtons = testTypeOptions.map((option) => {
        return (
            <label key={option}>
                <input
                    type="radio"
                    value={option}
                    checked={testType === option}
                    onChange={(e) => setTestType(e.target.value)}
                />
                {option}
            </label>
        );
    });

    const uploadFileField = (
        <div>
            <label>Upload File:</label>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />
        </div>
    );

    async function submit() {
        if (valid()) {
            makeRequest();
        }
    }

    const valid = () => {
        if (testType === '') {
            alert('Please select a test type.');
            return false;
        }
        if (file === null) {
            alert('Please upload a file.');
            return false;
        }
        if (fileContent === '') {
            alert('File content is empty.');
            return false;
        }
        return true;
    }

    const readFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setFileContent(e.target.result);
        }
        reader.readAsText(file);
    }

    const makeRequest = () => {
        axios.post(url, {
            'source_file_content': {
                'content': fileContent,
                'name': fileName
            },
            'prompt': `Generate a Groovy ${testType} test for the provided content.`,
            'additional_files': []
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
          .then(response => {
            window.console.log(response)
          })
          .catch(error => {
            window.console.log(error)
          })
    }

    const submitButton = (
        <button onClick={() => submit()}>Submit</button>
    );

    return (
        <div>
            <div>
                <label>Test Type:</label>
                {testTypeRadioButtons}
            </div>
            <div>
                {uploadFileField}
            </div>
            <div>
                {submitButton}
            </div>
        </div>
    );
}

export default TestForm;