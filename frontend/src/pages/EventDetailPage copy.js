import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, CircularProgress, Box, Button,
  Divider, Card, CardMedia, CardContent, Chip, Avatar,
  Accordion, AccordionSummary, AccordionDetails, Dialog,
  DialogTitle, DialogContent, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Switch
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import CloseIcon from '@mui/icons-material/Close';
import api from '../utils/api';
import logo from '../assets/nss_logo.png';
import ImageCarousel from '../components/ImageCarousel';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [attendedVolunteers, setAttendedVolunteers] = useState([]);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedVolunteerIds, setSelectedVolunteerIds] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/event/${id}/`);
        setEvent(response.data);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const fetchVolunteers = async () => {
    try {
      const [allResponse, attendedResponse] = await Promise.all([
        api.get('admin/volunteers/'),
        api.get(`/event/${id}/attended-volunteers/`)
      ]);
      const vol = allResponse.data;
      vol.forEach(v => {
        if (v.id in attendedResponse.data){
          v['attended'] = true;
        } else {
          v['attended'] = false;
        }
      });
      setAllVolunteers(vol);
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
    }
  };

  useEffect(() => {
    if (attendanceDialogOpen) {
      fetchVolunteers();
    }
  }, [attendanceDialogOpen]);

  const handleToggleAttendance = (volunteerId) => {
    setSelectedVolunteerIds((prevSelected) =>
      prevSelected.includes(volunteerId)
        ? prevSelected.filter((id) => id !== volunteerId)
        : [...prevSelected, volunteerId]
    );
  };

  const handleSubmitAttendance = async () => {
    try {
      await api.post(`/event/${id}/mark-attendance/`, { volunteer_ids: selectedVolunteerIds });
      fetchVolunteers();
      setAttendanceDialogOpen(false);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
  };

  const getStatusChip = (currentstatus) => {
    switch (currentstatus) {
      case 'Open':
        return <Chip label="Upcoming" color="primary" />;
      case 'Completed':
        return <Chip label="Completed" color="success" />;
      default:
        return <Chip label="Unknown" />;
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <Typography variant="h5">Event not found.</Typography>
      </Container>
    );
  }

  return (
    <Box
      maxWidth="md"
      sx={{
        margin: 'auto',
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Card
        sx={{
          boxShadow: 5,
          borderRadius: 2,
          position: 'relative'
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image="https://placehold.co/600x400"
          alt="Event Image"
        />
        <Box
          sx={{
            position: 'absolute',
            top: 250,
            left: 730,
            padding: '0.5em 1em'
          }}
        >
          {getStatusChip(event.status)}
        </Box>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <EventIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                {event.name}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {formatDateWithDay(event.start_datetime)} from {formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 'auto', boxShadow: 3 }}
              onClick={() => setAttendanceDialogOpen(true)}
            >
              Mark Attendance
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <DescriptionIcon />
              <Typography variant="body2" paragraph>
                {event.description}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AccessTimeIcon />
              <Typography variant="body2">{event.duration}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <PeopleIcon />
              <Typography variant="body2">12 people responded</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Avatar
                alt="National Service Scheme"
                src={logo}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant="body2">Event by NSS {event.college_name}</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" paragraph>
              <DescriptionIcon />
              {event.instructions}
            </Typography>
            { event.status === "Open" && (<Button
              variant="contained"
              color="primary"
              sx={{
                display: 'flex',
                gap: 2,
                ml: 'auto',
              }}
              onClick={() => setAttendanceDialogOpen(true)}
            >
              Complete Event
            </Button>
            )}
          </Box>
        </CardContent>
        <Accordion>
          <AccordionSummary>Event Media</AccordionSummary>
          <AccordionDetails>
            <ImageCarousel />
          </AccordionDetails>
        </Accordion>
      </Card>

      <Dialog
        open={attendanceDialogOpen}
        onClose={() => setAttendanceDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Mark Attendance
          <IconButton
            aria-label="close"
            onClick={() => setAttendanceDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">All Volunteers</Typography>
            <List>
              {allVolunteers.map((volunteer) => (
                <ListItem key={volunteer.id}>
                  <ListItemText primary={`${volunteer.first_name} ${volunteer.last_name}`} />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={selectedVolunteerIds.includes(volunteer.id)}
                      onChange={() => handleToggleAttendance(volunteer.id)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Attended Volunteers</Typography>
            <List>
              {attendedVolunteers.map((volunteer) => (
                <ListItem key={volunteer.id}>
                  <ListItemText primary={`${volunteer.first_name} ${volunteer.last_name}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitAttendance}
          >
            Submit Attendance
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default EventDetailPage;
