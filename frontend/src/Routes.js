import { Route, Routes as Router } from "react-router-dom";
import Home from './pages/Home';
// import Login from './pages/Login';
// import NotFound from './pages/NotFound';
// import { isAuthenticated } from "./utils/auth";
import PrivateRoute from "./components/PrivateRoute";

const Routes = () => {
    return (
      <Router>
      <Routes>
      <Route element={<PrivateRoute/>}>
      <Route element={<Home/>} path ="/"exact/>
      </Route>
    </Routes>
    </Router>
    )



}

export default Routes;