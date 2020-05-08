import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainMenu from './components/MainMenu'
import { v4 as uuidv4 } from 'uuid';
import socket from './connection';
import SocketContext from './socketContext';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Mafia.
        </p>
         <MainMenu clientID={uuidv4()} />
      </header>
    </div>
  );
}



 //<SocketContext.Provider value={socket}>
//  <MainMenu clientID={uuidv4()} />
//  </SocketContext.Provider>
export default App;
