import { Route, Navigate, Routes } from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {
  console.log("private route !! ");
  const authenticated = false;

  return (
    <Routes>
      <Route
        {...rest}element={!authenticated ? <Navigate to="/Login"/> : children}></Route>
        
    
    </Routes>
  );
};

export default PrivateRoute;