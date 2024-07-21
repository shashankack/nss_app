import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Grid, Typography, Avatar, CircularProgress, RadioGroup, FormControlLabel, Radio, Button,
  InputAdornment, TextField, Box } from '@mui/material';
import api from '../utils/api';
import pfp from '../assets/nss_logo.png'; // Ensure the path to your image file is correct

import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import RoleIcon from '@mui/icons-material/RecentActors';
import { useNavigate } from 'react-router-dom';

const VolunteerProfile = () => {
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  
  useEffect(() => {
    const fetchVolunteerDetails = async () => {
      try {
        const response = await api.get(`admin/volunteer/${id}/`);
        setVolunteer(response.data);
      } catch (error) {
        console.error('Failed to fetch volunteer details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerDetails();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const handleDelete = async (volunteerId) => {
    try {
      await api.delete(`/admin/volunteer/${volunteerId}/`);
      nav(-1);
      console.log('Volunteer deleted successfully');
    } catch (error) {
      console.error('Failed to delete Volunteer:', error);
    }
  };

  const handleBackClick = () => {
    nav(-1);
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'M':
        return <MaleIcon style={{ width: 50, height: 50, marginLeft: 10, marginTop: -16}} />;
      case 'F':
        return <FemaleIcon style={{ width: 50, height: 50, marginLeft: 10, marginTop: -16}} />;
      case 'O':
        return <TransgenderIcon style={{ width: 50, height: 50, marginLeft: 10, marginTop: -16}} />;
      default:
        return null;
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} display="flex" justifyContent="center">
            <Avatar src={pfp} alt={volunteer.first_name} sx={{ width: 100, height: 100, mb: 2 }} />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Typography variant="h6">{volunteer.first_name} {volunteer.last_name}</Typography> {getGenderIcon(volunteer.gender)}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="User Name"
              variant="outlined"
              value={`${volunteer.first_name} ${volunteer.last_name}`}
              InputProps={{
                startAdornment: (
                <InputAdornment>
                  <BadgeIcon sx={{ width: 24, height: 24, mr: 1 }}/>
                </InputAdornment>
                ),
              }}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email-ID"
              variant="outlined"
              value={volunteer.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <EmailIcon sx={{ width: 24, height: 24, mr: 1 }}/>
                  </InputAdornment>
                ),
              }}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="College"
              variant="outlined"
              value={volunteer.college}
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <SchoolIcon sx={{ width: 24, height: 24, mr: 1 }}/>
                  </InputAdornment>
                ),
              }}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Year"
              variant="outlined"
              value={volunteer.course_year}
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <CalendarMonthIcon sx={{ width: 24, height: 24, mr: 1 }}/>
                  </InputAdornment>
                ),
              }}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Blood Group"
              variant="outlined"
              value={volunteer.blood_group}
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <BloodtypeIcon sx={{ width: 24, height: 24, mr: 1 }}/>
                  </InputAdornment>
                ),
              }}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role"
              variant="outlined"
              value={volunteer.role}
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <RoleIcon sx={{ width: 24, height: 24, mr: 1 }}/>
                  </InputAdornment>
                ),
              }}
              disabled
            />
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="center">
            <Button onClick={handleBackClick} variant="contained" color="primary" sx={{ width: '50%' }}>back</Button>
          </Grid>
          <Grid item xs={6} display="flex" justifyContent="center">
            <Button onClick={() => handleDelete(volunteer.id)} variant="contained" color="error" sx={{ width: '50%' }}>Delete</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default VolunteerProfile;
