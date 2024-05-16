import { Route, Routes as RRoutes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { isAuthenticated } from "./utils/auth";


const Routes = () => {
    return (
        <RRoutes>
            <Route exact path="/" element={ {isAuthenticated} ? <Home/> : <Login/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/*" element={<NotFound/>} />
        </RRoutes>
    )
}

export default Routes;