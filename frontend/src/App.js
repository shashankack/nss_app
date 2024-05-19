// import NotFound from '/.pages/NotFound';
// import api from './utils/api';
// import Navbar from './components/Navbar'; 
// import Routes from './Routes';
// import api from './utils/auth';
import React from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoutes from './components/ProtectedRoutes';
import { BrowserRouter as Router,Route,Routes,useNavigation, Navigate, BrowserRouter } from 'react-router-dom';


function Logout(){
  localStorage.clear()
  return<Navigate to = "/Login"/>
}
function App() { 
  return (
<div className='App'>
<>
<BrowserRouter>
<Routes>
  <Route path="/" 
  element={<ProtectedRoutes><Home/>
  </ProtectedRoutes>}/>

<Route path="/Login" element ={<Login/>}/>
<Route path="*" element ={<NotFound/>}/>
</Routes>
</BrowserRouter>
</>
  
    </div>
  );
}

export default App;