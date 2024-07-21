import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material'; // Import necessary components from Material-UI or other libraries
import api from '../utils/api'; // Assuming you have an API utility for making requests

const EventDetailPage = () => {
  const { id } = useParams(); // Fetching the dynamic 'id' parameter from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/event/${id}/`); // Assuming your API endpoint for fetching event details
        setEvent(response.data);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]); // Fetch event details whenever 'id' changes

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
    <Container>
      <Typography variant="h4">{event.name}</Typography>
      <Typography variant="body1">{event.description}</Typography>
      <Typography variant="body2">Start Date: {event.start_date}</Typography>
      <Typography variant="body2">Start Time: {event.start_time}</Typography>
      {/* Render other event details as needed */}
    </Container>
  );
};

export default EventDetailPage;
