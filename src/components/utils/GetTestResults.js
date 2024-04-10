import React, {useState, useEffect} from "react";
import axios from 'axios';

async function GetTestResults({testRequest, setTestRequest, testResults, setTestResult}) {

    const MAX_RETRY = 10; 
    const [testProcess, setTestProcess] = useState({});

    const url = `http://localhost:8000/job/`


    // does changing the tried here in the element actually change the value in the testRequest?
    useEffect(() => {
        Object.keys(testRequest).forEach((key) => {
            if (!testRequest[key].tried && testRequest[key].status === 'loading') {
                setTestProcess({...testProcess, [key]: {
                    currentRetry: 0,
                }});
                setTestRequest({...testRequest, key: {...testRequest[key], tried: true}});
            }
        });
        window.console.log(testProcess);
    }, [testRequest])

    useEffect(() => {
        testProcess?.forEach(element => {
            if (element.currentRetry < MAX_RETRY) {
                element.currentRetry++;
                setTestProcess([...testProcess, element]);
                sendWithRetry(element.uuId);
            } else {
                console.log('Retried several times but still failed');
            }
        });
    }, [testProcess])

    async function sendWithRetry(uuId)  {
        if (testProcess[uuId].currentRetry >= MAX_RETRY) {
            setTestRequest({...testRequest, [uuId]: {...testRequest[uuId], status: 'error'}});
        }

        await new Promise(r => setTimeout(r, 20000));

        axios.get(`${url}${uuId}`)
        .then((response) => {
            if (response.data.status !== 'Ready') {
                setTestRequest({...testRequest, [uuId]: {...testRequest[uuId], status: 'error'}});
                throw new axios.Error("Error fetching the data");
            } else {
                // set the test request state to ready
                setTestRequest({...testRequest, [uuId]: {...testRequest[uuId], status: 'ready'}});
                // set the test result state to the code and file name
                setTestResult([...testResults, {fileName: testRequest[uuId].fileName, code: response.data.answer.code, uuId: uuId}])
            }
        })
        .catch((error) => {
            setTestProcess({...testProcess, [uuId]: {...testProcess[uuId], currentRetry: testProcess[uuId].currentRetry + 1}});
            sendWithRetry(uuId);
        });
    }

    return null;

}