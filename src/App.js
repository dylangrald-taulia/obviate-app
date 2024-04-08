import './App.css';
import axios from 'axios';
import TestForm from './components/TestForm';

function App() {

  const url = '//localhost:8000/'

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
      <TestForm />
    </div>
  );
}

export default App;
