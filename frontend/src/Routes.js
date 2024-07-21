import { Route, Routes as RRoutes } from "react-router-dom";
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import EventDetailPage from './pages/EventDetailPage'; 
import { isAuthenticated } from "./utils/auth";


const Routes = () => {
    return (
        <RRoutes>
            <Route exact path="/" element={ {isAuthenticated} ? <Home/> : <Login/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/*" element={<NotFound/>} />
            <Route path="/event/:id" element={<EventDetailPage />} />
        </RRoutes>
    )
}

export default Routes;