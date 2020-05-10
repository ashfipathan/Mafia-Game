import React from 'react';
import logo from './logo.svg';
import './App.css';
import ComponentController from './components/ComponentController'
import { v4 as uuidv4 } from 'uuid';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Mafia.
        </p>
         <ComponentController clientID={uuidv4()} />
      </header>
    </div>
  );
}

export default App;
