// routes.js
import React from 'react';
import { Route, Routes as RRoutes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const Routes = () => {
  return (
    <RRoutes>
      <Route path="/login"  element={<Login/>} />
      <Route exact path="/"  element={<Home/>} />
      <Route path="*" element={<NotFound/>} />
      
    </RRoutes>
  );
}

export default Routes;