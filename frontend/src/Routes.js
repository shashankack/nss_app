import { Route, Routes as RRoutes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { isAuthenticated } from "./utils/auth";


const Routes = () => {
<<<<<<< Updated upstream
    return (
        <RRoutes>
            <Route exact path="/" element={ {isAuthenticated} ? <Home/> : <Login/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/*" element={<NotFound/>} />
        </RRoutes>
    )
=======
  return (
    <RRoutes>
      <Route path="/login"  element={<Login/>} />
      <Route element={<PrivateRoutes/>}> <Route exact path="/"  element={<Home/>} />
      </Route>   
      <Route path="*" element={<NotFound/>} />
      
    </RRoutes>
  );
>>>>>>> Stashed changes
}

export default Routes;