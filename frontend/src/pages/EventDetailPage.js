import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Paper, Grid, Avatar, Box, Button,
         Divider, Card, CardMedia, CardContent
        } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import api from '../utils/api';
import TransferListPopup from '../components/TransferListPopup';
import logo from '../assets/nss_logo.png';
import img from '../assets/Gallery_Images/Trek/trek_1.jpg'

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
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image="https://placehold.co/600x400"
          alt="Event Image"
        />
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
            <Typography variant="body2" paragraph>
              <DescriptionIcon />
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
          <Typography variant="body2" paragraph>
            <DescriptionIcon />
            {event.instructions}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventDetailPage;
