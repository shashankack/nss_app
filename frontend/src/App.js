import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import Navbar from './components/Navbar'; 
function App() { 
  return (

    <Router>
      <div className="App">
        <Navbar />
        <Routes /> 
      </div>
    </Router>

  );
}

export default App;
