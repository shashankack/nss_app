import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Routes from './Routes'; 

function App() {
  return (
    <Router>
<<<<<<< Updated upstream
      <div className='App'>
        <Navbar />
        <Routes />
=======
      <div className="App">
        <Navbar /> 
        <Routes /> {/* Render the Routes component */}
>>>>>>> Stashed changes
      </div>
    </Router>
  )
}

export default App;