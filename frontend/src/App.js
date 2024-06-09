import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Routes from './Routes'; 

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <Routes />
      </div>
    </Router>
  )
}

export default App;