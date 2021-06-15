import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./router";
import Firebase, { FirebaseContext } from './firebase';
import './App.css';


function App() {
  return (
    <div className="App">
      <FirebaseContext.Provider value={new Firebase()}>
        <Router>
          <Routes />
        </Router>
      </FirebaseContext.Provider>
    </div>
  );
}

export default App;
