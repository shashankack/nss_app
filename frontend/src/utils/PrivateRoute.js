import {  Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  console.log("LOgin FIrst!! ");
  let authenticated = {'token':false};

  return (
     authenticated.token ? <Outlet/> : <Navigate to ="/Login"/>
  );
};

export default PrivateRoute;