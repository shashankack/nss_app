// app.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Navbar from './components/Navbar'; // Import Navbar component

function App() {

  
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes /> {/* Render the Routes component */}
      </div>
    </Router>
  );
}

export default App;
