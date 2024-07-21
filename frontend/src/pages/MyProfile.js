import React, { useState } from 'react';
import { Box, Button, Avatar, Typography, Grid, Paper, LinearProgress, Card, CardContent, CardHeader, Divider, Collapse } from '@mui/material';
import { EmojiEvents, School } from '@mui/icons-material';

const MyProfile = () => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [openEvents, setOpenEvents] = useState(false);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMouseX(event.clientX - rect.left);
    setMouseY(event.clientY - rect.top);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`;
  };

  // Static user data
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'john.doe',
    email: 'john.doe@example.com',
    role: 'Volunteer',
    totalCreditPoints: 150,
    attendance: 95,
    bloodGroup: 'O+',
    gender: 'Male',
    events: [
      { title: 'Event 1', date: '2024-07-01', time: '10:00 AM', creditPoints: 10 },
      { title: 'Event 2', date: '2024-07-10', time: '02:00 PM', creditPoints: 20 },
      { title: 'Event 3', date: '2024-07-15', time: '11:00 AM', creditPoints: 15 },
    ],
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, width: '100%' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {getInitials(user.firstName, user.lastName)}
            </Avatar>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h4" component="div">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">@{user.username}</Typography>
            <Typography variant="body1" color="textSecondary">{user.email}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" component="div" gutterBottom>Profile Details</Typography>
            <Typography variant="body1" component="div" sx={{ mt: 1 }}>
              <strong>Role:</strong> {user.role}
            </Typography>
            <Typography variant="body1" component="div" sx={{ mt: 1 }}>
              <strong>Blood Group:</strong> {user.bloodGroup}
            </Typography>
            <Typography variant="body1" component="div" sx={{ mt: 1 }}>
              <strong>Gender:</strong> {user.gender}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Card
              sx={{
                mb: 2,
                '&:hover': {
                  boxShadow: 6,
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <CardHeader
                avatar={<EmojiEvents color="primary" />}
                title={<Typography variant="h6">Total Credit Points</Typography>}
                subheader={<Typography variant="subtitle1">{user.totalCreditPoints}</Typography>}
              />
            </Card>
            <Card
              sx={{
                '&:hover': {
                  boxShadow: 6,
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <CardHeader
                avatar={<School color="primary" />}
                title={<Typography variant="h6">Attendance</Typography>}
                subheader={<Typography variant="subtitle1">{user.attendance}%</Typography>}
              />
              <CardContent>
                <LinearProgress variant="determinate" value={user.attendance} />
              </CardContent>
              <Button
                onClick={() => setOpenEvents(!openEvents)}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                {openEvents ? 'Hide Events' : 'Show Events'}
              </Button>
              <Collapse in={openEvents}>
                <Box sx={{ mt: 2 }}>
                  {user.events.map((event, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{event.title}</Typography>
                        <Typography variant="body1">
                          <strong>Date:</strong> {event.date}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Time:</strong> {event.time}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Credit Points:</strong> {event.creditPoints}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Collapse>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(0, 123, 255, 0.6), transparent)`,
                    pointerEvents: 'none',
                  },
                }}
                onMouseMove={handleMouseMove}
                variant="outlined"
                color="primary"
              >
                Edit Details
              </Button>
              <Button
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 0, 0, 0.6), transparent)`,
                    pointerEvents: 'none',
                  },
                }}
                onMouseMove={handleMouseMove}
                variant="outlined"
                color="secondary"
              >
                Reset Password
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MyProfile;
