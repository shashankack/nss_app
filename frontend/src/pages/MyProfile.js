import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Avatar, Typography, Grid, Paper, CircularProgress, Card, CardHeader,
  Divider, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, CardContent,
  CardActionArea, Chip
} from '@mui/material';
import { EmojiEvents, School } from '@mui/icons-material';
import api from '../utils/api';

const MyProfile = () => {
  const [openEventsDialog, setOpenEventsDialog] = useState(false);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  // Function to get details stored in the local storage from 'userData'
  const getUserData = () => {
    const userData = localStorage.getItem('userDetails');
    if (userData) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  };

  //Funtction to handle card click, which will go to that event details page
  const handleCardClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  useEffect(() => {
    // API call to get attended events
    api.get('volunteer/events-attended/')
      .then((response) => {
        setAttendedEvents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Set user details from local storage
    setUser(getUserData());
  }, []);

  const handleCloseEventsDialog = () => {
    setOpenEventsDialog(false);
  };

  const handleOpenEventsDialog = () => {
    setOpenEventsDialog(true);
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 'md', width: '100%' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 170, height: 170, fontSize: 100 }}>
              {user && getInitials(user.first_name, user.last_name)}
            </Avatar>
          </Grid>
          <Grid item xs={9}>
            {user && (
              <>
                <Typography variant="h4" component="div">
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  @{user.username}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {user.email}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" component="div" gutterBottom>
                  Profile Details
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 1 }}>
                  <strong>Role:</strong> {user.role}
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 1 }}>
                  <strong>Blood Group:</strong> {user.blood_group}
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 1 }}>
                  <strong>Gender:</strong> {user.gender}
                </Typography>
              </>
            )}
            <Divider sx={{ my: 2 }} />
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardHeader
                avatar={<EmojiEvents color="primary" sx={{ width: 40, height: 40 }} />}
                title={<Typography variant="h6">Total Credit Points</Typography>}
                subheader={<Typography variant="subtitle1">{user ? user.credits_earned : 0}</Typography>}
                hidden={!user || user.role === "Admin"}
              />
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card
              sx={{
                '&:hover': {
                  boxShadow: 6,
                  backgroundColor: 'rbga(255, 255, 255, 1)',
                },
                cursor: 'pointer'
              }}
              onClick={handleOpenEventsDialog}
              hidden={!user || user.role === "Admin"}
            >
              <CardHeader
                avatar={
                  <Box position="relative" display="inline-flex">
                    <CircularProgress
                      variant="determinate"
                      value={user ? user.attendance : 0}
                      sx={{
                        color: 'primary.main',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                      }}
                      size={40}
                    />
                    <School color="primary" sx={{ width: 40, height: 40 }} />
                  </Box>
                }
                title={<Typography variant="h6">Attendance</Typography>}
                subheader={<Typography variant="subtitle1 ">{user ? `${user.attendance_percentage}%` : '0%'}</Typography>}
              />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Dialog open={openEventsDialog} onClose={handleCloseEventsDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textDecoration: 'underline' }}>Events Attended</DialogTitle>
        <DialogContent>
          <List>
            {attendedEvents.length > 0 ? (
              attendedEvents.map((event, index) => (
                <ListItem key={index} disablePadding sx={{ marginBottom: 2 }}>
                  <Card variant="outlined" sx={{ width: '100%' }}>
                  <CardActionArea onClick={() => handleCardClick(event.id)}>
                    <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {event.name}
                          </Typography>
                          <Chip label={event.status} color="success" />
                        </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                        Date: {new Date(event.start_datetime).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Credits: {event.credit_points}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  </Card>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                No events attended
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEventsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyProfile;
