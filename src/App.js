import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import TestForm from './components/TestForm';
import TestStatusIcon from './components/TestStatusIcon';
import CodeDisplay from './components/CodeDisplay';

function App() {

  const [testRequest, setTestRequest] = useState([])
  const [testResults, setTestResults] = useState([])

  const url = '//localhost:8000/'

  React.useEffect(() => {
    window.console.log(testRequest)
  }, [testRequest])

  const updateTestRequest = (newTestRequest) => {
    setTestRequest(newTestRequest)
  }

  const makeRequest = () => {
    axios.get(url)
      .then(response => {
        window.console.log(response)
      })
      .catch(error => {
        window.console.log(error)
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Obviation</h1>
      </header>
      <div>
        <label>This is a sanity check: </label>
        <button onClick={() => makeRequest()}>Make GET Request</button>
      </div>
      <TestForm setTestRequest={updateTestRequest} testRequest={testRequest} />
      <TestStatusIcon testRequest={testRequest} setTestRequest={setTestRequest} />
      <CodeDisplay testResults={testResults} setTestResults={setTestResults} />
    </div>
  );
}

export default App;
