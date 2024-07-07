import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Groups2Icon from '@mui/icons-material/Groups2';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import logo from "../assets/nss_logo.png";
import api from '../utils/api';

const HomePage = () => {
    const [userRole, setUserRole] = useState('');
    const nav = useNavigate();

    useEffect(() => {
        // Fetch the logged in user's role
        api.get('/loggedinuser')
            .then(response => setUserRole(response.data.role))
            .catch(error => console.error('Error fetching user role:', error));
    }, []);

    const handleCardClick = (path) => {
        nav(path);
    };

    
    

function HomeCard({ title, tagline, url, icon }) {
  const handleCardClick = (url) => {
    // Define your card click handler logic here
    nav(url);
  };

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



    
    
    const AdminCards = () => {
        return (
            <Container>
                <Grid container spacing={6}>
                    <HomeCard title="Manage Volunteers" tagline="Manage volunteers of your college." url="/manage-volunteers" icon={<Groups2Icon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />}/>
                    <HomeCard title="Manage Events" tagline="Create and manage events." url="/events" icon={<EventIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />}/>
                    <HomeCard title="My Profile" tagline="View and edit your profile." url="/profile" icon={<PersonIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />}/>
                </Grid>
            </Container>
        );
    };

    const VolunteerCards = () => {
        return (
            <Container>
                <Grid container spacing={6} style={{marginLeft: '9em'}}>
                    <HomeCard title="View Events" tagline="Upcoming and Completed Events." url="/events" icon={<EventIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />}/>
                    <HomeCard title="My Profile" tagline="View and edit your profile." url="/profile" icon={<PersonIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />}/>
                </Grid>
            </Container>
            );    
    };

    const LeaderCards = () => {
        return (
            <Container>
                <Grid container spacing={6} style={{marginLeft: '9em'}}>
                    <HomeCard title="Manage Events" tagline="Create and manage events." url="/events" icon={<EventIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />}/>
                    <HomeCard title="My Profile" tagline="View and edit your profile." url="/profile" icon={<PersonIcon style={{ marginRight: 10, marginTop: '-0.5rem', fontSize: 60 }} />}/>
                </Grid>
            </Container>
            );
        };
    
        return (
            <div>
                <img src={logo} alt="Image" style={{ display: 'block', margin: '5em auto', width: '18%' }} />
                {userRole === 'Admin' ? <AdminCards /> : userRole === 'Volunteer' ? <VolunteerCards /> : <LeaderCards />}
            </div>
        );
    };
    
    export default HomePage;
