// import NotFound from '/.pages/NotFound';
// import api from './utils/api';
// import Navbar from './components/Navbar'; 
// import Routes from './Routes';
// import api from './utils/auth';
import React from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Header from './components/Header';
import PrivateRoute from './utils/PrivateRoute';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';

function App() { 
  return (
<div className='App'>

    <Router>   
      <Header/>
      <PrivateRoute Component ={Home} path="/" />  
  <Routes>
  {/* <PrivateRoute Component ={Home} path="/" exact/>  */}
   
      <Route Component={Login}path='/Login'/>    
  </Routes>
    </Router>
    </div>
  );
}

export default App;
