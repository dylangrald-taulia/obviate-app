import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import '../App.css';

function TestForm({setTestRequest, testRequest, testResults, setTestResults, promptDetails, setPromptDetails}) {
    const [testType, setTestType] = useState('');
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [testProcess, setTestProcess] = useState({});
    const [code, setCode] = useState('');
    const [testLanguage, setTestLanguage] = useState('');
    const [pullAdditionalFiles, setPullAdditionalFiles] = useState(false);

    const axiosGetClient = axios.create({});

    const MAX_RETRY = 10;
    // let currentRetry = 0;

    const url = '//localhost:8000/create-prompt-async/'
    const getJobUrl = `http://localhost:8000/job/`

    function successHandler() {
        console.log('Data is Ready');
        console.log('Code: '+code);
    }

    async function errorHandler(uuId, currentRetry) {
        if (currentRetry < MAX_RETRY) {
        //   currentRetry++;
          setTestProcess({...testProcess, [uuId]: {currentRetry: currentRetry + 1, sentWithRetry: true}});
          console.log('Retrying...');
          sendWithRetry(uuId);
        } else {
          console.log('Retried several times but still failed');
        }
      }
            
    async function sendWithRetry(uuId) {

        await new Promise(r => setTimeout(r, 20000));

        // testRequest?.forEach(element => {
        //     console.log('Sending request...'+element.uuId);
        //     axiosGetClient.get(`http://localhost:8000/job/${element.uuId}`)
        //     .then(successHandler).catch(errorHandler);
        // });

        // Object.keys(testProcess).forEach((key) => {
        //     console.log('Sending request...'+key);
        //     axiosGetClient.get(`${getJobUrl}${key}`)
        //     .then(successHandler(uuId)).catch(errorHandler(key, testProcess[key].currentRetry));
        // })

        console.log('Sending request...'+uuId);
        window.console.log('Current Retry: '+testProcess[uuId].currentRetry);
        axiosGetClient.get(`${getJobUrl}${uuId}`)
            .then(successHandler(uuId))
            .catch(errorHandler(uuId, testProcess[uuId].currentRetry))
            .catch((error) => {
                console.log('Error: '+error);
            });
    }
      
    axiosGetClient.interceptors.response.use(function (response) {
        window.console.log('Response: '+response.data.status);
        window.console.log('Response: '+response);
        if(response.data.status !== 'Ready') { 
          throw new AxiosError("Error fetching the data"); 
        } else {
          setCode(response.data.answer.code);
          setTestRequest({...testRequest, [response.data.job_uuid]: {...testRequest[response.data.job_uuid], status: 'ready', response: response.data.answer.code}});
          setTestResults([...testResults, {fileName: testRequest[response.data.job_uuid].fileName, code: response.data.answer.code, uuId: response.data.job_uuid}])
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
        Object.keys(testRequest).forEach((key) => {
            if (!testRequest[key].tried && testRequest[key].status === 'loading') {
                window.console.log('Validating request...');
                window.console.log(`test request key: ${testRequest[key]}`);
                setTestProcess({...testProcess, [key]: {
                    ...testProcess[key],
                    currentRetry: 0,
                    sentWithRetry: false,
                }});
                setTestRequest({...testRequest, [key]: {...testRequest[key], tried: true}});
            }
        });
    },[testRequest])

    React.useEffect(() => {
        window.console.log(testProcess);
        Object.keys(testProcess).forEach((key) => {
            if (!testProcess[key].sentWithRetry) {
                sendWithRetry(key);
                setTestProcess({...testProcess, [key]: {...testProcess[key], sentWithRetry: true}});
            }
        });
    }, [testProcess])

    const readFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setFileContent(e.target.result);
        }
        reader.readAsText(file);
    }

    const uploadFileField = (
        <>
            <h4>Upload File</h4>
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />
        </>
    );

    const pullAdditionalFilesCheckbox = (
        <label>
        <input
          type="checkbox"
          checked={pullAdditionalFiles}
          onChange={(e) => setPullAdditionalFiles(e.target.value)}
        />
        Pull Supplementary Files Via GitHub
      </label>
    );

    const updateTestType = (type) => {
        setTestType(type);
        if (type === 'Groovy Unit Test') {
            setTestLanguage('Groovy');
        } else {
            setTestLanguage('JavaScript');
        }
    };

    const testTypeOptions = ['Groovy Unit Test', 'JavaScript Unit Test']

    const testTypeRadioButtons = testTypeOptions.map((option) => {
        return (
            <label key={option}>
                <input
                className='test-type-radio-button'
                    type="radio"
                    value={option}
                    checked={testType === option}
                    onChange={(e) => updateTestType(e.target.value)}
                />
                {option}
            </label>
        );
    });

    const promptDetailsInput = (
        <>
            <h4>Optional Prompt Details</h4>
            <textarea
                className='prompt-details-input'
                value={promptDetails}
                onChange={(e) => setPromptDetails(e.target.value)}
            />
        </>
    );

    const submitButton = (
        <button className='submit-button' onClick={() => submit()}>Submit</button>
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
            'prompt': `Generate a ${testType} for the provided content.` + (promptDetails ? ` ${promptDetails}` : ''),
            'test_type': testLanguage,
            'pull_additional_files': pullAdditionalFiles,
            'additional_files': []
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
          .then(response => {
            window.console.log(response)
            setTestRequest({...testRequest, [response.data.job_uuid]: {
                fileName: fileName,
                status: 'loading',
                tried: false,
            }
            })
            setFile(null);
            setFileContent('');
            setFileName('');
            setPromptDetails('');
            setTestType('');
          })
          .catch(error => {
            window.console.log(error)
          })
    }

    return (
        <div className='test-form-div'>
                <h4>Test Type</h4>
                {testTypeRadioButtons}
                {uploadFileField}
                {pullAdditionalFilesCheckbox}
                {promptDetailsInput}
                {submitButton}
        </div>
    );
}

export default TestForm;