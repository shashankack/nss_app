import React from 'react';
import { Route, BrowserRouter as Router,Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import NewRoutes from './NewRoutes'; 
import PrivateRoute from './components/PrivateRoute';
function App() {
  return (
      <div className='App'>
        <NewRoutes /> 
      </div>
  )
}

export default App;