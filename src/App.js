import './App.css';
import axios from 'axios';

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
        <button onClick={() => makeRequest()}>Hello?</button>
      </header>
    </div>
  );
}

export default App;
