import React, { useState } from 'react';
import './App.css';
import TestForm from './components/TestForm';
import TestStatusIcon from './components/TestStatusIcon';
import CodeDisplay from './components/CodeDisplay';
import AudioCapture from "./components/SpeechToText";

function App() {

  const [testRequest, setTestRequest] = useState({})
  const [testResults, setTestResults] = useState([])
  const [promptDetails, setPromptDetails] = useState('');

  const updateTestRequest = (newTestRequest) => {
    setTestRequest(newTestRequest)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Obviation</h1>
      </header>
      <TestForm setTestRequest={updateTestRequest} testRequest={testRequest} testResults={testResults} setTestResults={setTestResults} promptDetails={promptDetails} setPromptDetails={setPromptDetails} />
      <AudioCapture setPromptDetails={setPromptDetails}></AudioCapture>
      <TestStatusIcon testRequest={testRequest} />
      <CodeDisplay testResults={testResults} />
    </div>
  );
}

export default App;
