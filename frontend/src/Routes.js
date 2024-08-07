import { Route, Routes as RRoutes } from "react-router-dom";
import Home from './pages/Home';
import EventListPage from './pages/EventListPage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import EventDetailPage from './pages/EventDetailPage'; 
import { isAuthenticated } from "./utils/auth";
import ManageVolunteers from "./pages/ManageVolunteers";
import VolunteerProfile from './pages/VolunteerProfile';
import ResetPassword from "./pages/ResetPassword";
import Leaderboard from "./pages/Leaderboard";
import MyProfile from "./pages/MyProfile";

const Routes = () => {
    return (
        <RRoutes>
            <Route exact path="/" element={ {isAuthenticated} ? <Home/> : <Login/>} />
            <Route path="/admin/manage-volunteers" element={<ManageVolunteers />} />
            <Route path="/admin/volunteer/:id" element={<VolunteerProfile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<MyProfile/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/*" element={<NotFound/>} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/events" element={<EventListPage />} />
        </RRoutes>
    )
}

export default Routes;