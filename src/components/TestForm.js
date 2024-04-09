import React, { useState } from 'react';
import axios from 'axios';

function TestForm({setTestRequest, testRequest}) {
    const [testType, setTestType] = useState('');
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [promptDetails, setPromptDetails] = useState('');
    const [code, setCode] = useState(''); 

    const axiosGetClient = axios.create({});

    const MAX_RETRY = 10;
    let currentRetry = 0;

    const url = '//localhost:8000/create-prompt-async/'

    function successHandler() {
        console.log('Data is Ready');
        console.log('Code: '+code);
    }

    async function errorHandler() {
        if (currentRetry < MAX_RETRY) {
          currentRetry++;
          console.log('Retrying...');
          sendWithRetry();
        } else {
          console.log('Retried several times but still failed');
        }
      }
            
    async function sendWithRetry() {

        await new Promise(r => setTimeout(r, 20000));

        testRequest?.forEach(element => {
            console.log('Sending request...'+element.uuId);
            axiosGetClient.get(`http://localhost:8000/job/${element.uuId}`)
            .then(successHandler).catch(errorHandler);
        });

    }
      
    axiosGetClient.interceptors.response.use(function (response) {
        if(response.data.status !== 'Ready') { 
          throw new axios.Error("Error fetching the data"); 
        } else {
          setCode(response.data.answer.code);
          return response;
        }
      }, function (error) {
        return Promise.reject(error);
    });

    React.useEffect(() => {
        if (file) {
            setFileName(file.name);
            readFile(file);
        }
    }, [file]);

    React.useEffect(() => {
         sendWithRetry();
    },[testRequest])

    const readFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setFileContent(e.target.result);
        }
        reader.readAsText(file);
    }

    const uploadFileField = (
        <div>
            <label>Upload File:</label>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />
        </div>
    );

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

    const promptDetailsInput = (
        <div>
            <label>Optional Prompt Details:</label>
            <textarea
                value={promptDetails}
                onChange={(e) => setPromptDetails(e.target.value)}
            />
        </div>
    );

    const submitButton = (
        <button onClick={() => submit()}>Submit</button>
    );

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

    async function submit() {
        if (valid()) {
            makeRequest();
        }
    }

    const makeRequest = () => {
        axios.post(url, {
            'source_file_content': {
                'content': fileContent,
                'name': fileName
            },
            'prompt': `Generate a Groovy ${testType} test for the provided content.` + (promptDetails ? ` ${promptDetails}` : ''),
            'additional_files': []
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
          .then(response => {
            window.console.log(response)
            setTestRequest(testRequest.concat({
                uuId: response.data.job_uuid,
                fileName: fileName,
                status: response.data.loading ? 'loading' : 'error',
            }))
          })
          .catch(error => {
            window.console.log(error)
          })
    }

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
                {promptDetailsInput}
            </div>
            <div>
                {submitButton}
            </div>
        </div>
    );
}

export default TestForm;