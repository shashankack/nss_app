import React from 'react';
import { Route, BrowserRouter as Router,Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Routes from './Routes'; 
import PrivateRoute from './components/PrivateRoute';
function App() {
  return (
      <div className='App'>
        <Routes /> 
      </div>
  )
}

export default App;