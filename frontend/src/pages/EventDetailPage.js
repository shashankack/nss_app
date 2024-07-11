import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Paper, Grid, Avatar, Box, Button,
         Divider, Accordion, AccordionSummary, AccordionDetails
        } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import Gallery from '../components/Gallery';
import api from '../utils/api';
import TransferListPopup from '../components/TransferListPopup';
import logo from '../assets/nss_logo.png';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = {hour: '2-digit', minute: '2-digit'};
    return date.toLocaleTimeString('en-US', options);
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, height: 60, width: 60 }} src={logo}></Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {event.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Organized by NSS 
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ border: '1px solid', mb: 3 }}/>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="textSecondary">
            {event.description}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                {formatDateWithDay(event.start_datetime)} from {formatTime(event.start_datetime)} to {formatTime(event.end_datetime)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                {event.duration} - 12 people responded
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PlaceIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                {event.location}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" color="textPrimary">
              <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Event Gallery
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Gallery />
          </AccordionDetails>
        </Accordion>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" onClick={() => setIsPopupOpen(true)}>
            Mark Attendance
          </Button>
        </Box>
      </Paper>
      <TransferListPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} eventId={id} />
    </Container>
  );
};

export default EventDetailPage;
