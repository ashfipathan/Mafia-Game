import React from 'react';
import './App.css';
import ComponentController from './components/ComponentController'
import { v4 as uuidv4 } from 'uuid';

function App() {
  return (
    <div className="App">
      <ComponentController className="App-header" clientID={uuidv4()} />
    </div>
  );
}

export default App;
