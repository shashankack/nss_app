import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActionArea, Box, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Groups2Icon from '@mui/icons-material/Groups2';
import EventIcon from '@mui/icons-material/Event';
import logo from "../assets/nss_logo.png";
import api from '../utils/api';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Alert from '@mui/material/Alert';

const HomePage = () => {
    const [userRole, setUserRole] = useState('');
    const [college, setCollege] = useState('');
    const [serviceHours, setServiceHours] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        // Fetch the logged-in user's role
        api.get('/loggedinuser')
            .then(response => {setUserRole(response.data.role); setCollege(response.data.college)})
            .catch(error => console.error('Error fetching user role:', error));

        api.get('/service-hours/')
            .then(response => setServiceHours(response.data))
            .catch(error => console.error('Error fetching user role:', error));
        
    }, []);

    const handleCardClick = (path) => {
        nav(path);
    };

    function HomeCard({ title, tagline, url, icon }) {
        return (
            <Grid item xs={12} md={4}>
                <Card elevation={15}>
                    <CardActionArea onClick={() => handleCardClick(url)}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                {icon}
                                <Typography variant="h5">{title}</Typography>
                            </Box>
                            <Typography variant="body2">{tagline}</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    }

    const AdminCards = () => (
        <Container>
            <Grid container spacing={6} justifyContent="center">
                <HomeCard title="Manage Volunteers" tagline="Manage volunteers of your college." url="admin/manage-volunteers" icon={<Groups2Icon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />} />
                <HomeCard title="Manage Events" tagline="Create and manage events." url="/events" icon={<EventIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />} />
                <HomeCard title="Leaderboard" tagline="View the leaderboard." url="/leaderboard" icon={<EmojiEventsIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />}/>
            </Grid>
        </Container>
    );

    const VolunteerCards = () => (
        <Container>
            <Grid container spacing={6} justifyContent="center">
                <HomeCard title="View Events" tagline="Upcoming and Completed Events." url="/events" icon={<EventIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />} />
                <HomeCard title="Leaderboard" tagline="View the leaderboard." url="/leaderboard" icon={<EmojiEventsIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />} />
            </Grid>
        </Container>
    );

    const LeaderCards = () => (
        <Container>
            <Grid container spacing={6} justifyContent="center">
                <HomeCard title="Manage Events" tagline="Create and manage events." url="/events" icon={<EventIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />} />
                <HomeCard title="Leaderboard" tagline="View the leaderboard." url="/leaderboard" icon={<EmojiEventsIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />}/>
            </Grid>
        </Container>
    );

    return (
        <div>
            <img src={logo} alt="Image" style={{ display: 'block', margin: '5em auto', width: '18%' }} />
            {userRole === 'Admin' ? <AdminCards /> : userRole === 'Volunteer' ? <VolunteerCards /> : <LeaderCards />}
            <div style={{
              position: 'fixed',
              bottom: 50,
              left: 450,
              right: 0,
              backgroundColor: '#4caf50', // or use your theme's success color
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              width: 1000,
              padding: '16px',
              zIndex: 1200, // Ensure it appears above other content
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Optional shadow
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '10px',
            }}>
              <Typography variant="body1">
                Thank you for your service. Together {college} has contributed {serviceHours} hours of service to our community.
              </Typography>
            </div>
        </div>
    );
};

export default HomePage;
