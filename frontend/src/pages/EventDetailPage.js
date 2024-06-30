import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  TextField,
  Button, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditNoteIcon from '@mui/icons-material/EditNote';
import api from '../utils/api';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={24} sx={{ p: 5,  borderRadius: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {event.name}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Button variant="outlined">Mark Attendance</Button>
          </Grid>
          <Grid item md={6} sm={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="textPrimary">
                  <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Description
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="textSecondary">
                  {event.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item md={6} sm={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color="textPrimary">
                  <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Instructions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="textSecondary" >
                {event.instructions}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Time"
              value={new Date(event.start_datetime).toLocaleString()}
              InputProps={{
                startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />,
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Time"
              value={new Date(event.end_datetime).toLocaleString()}
              InputProps={{
                startAdornment: <AccessTimeIcon sx={{ mr: 1 }} />,
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Duration"
              value={event.duration}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={event.location}
              InputProps={{
                startAdornment: <PlaceIcon sx={{ mr: 1 }} />,
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Status"
              fullWidth
              value={event.status}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Credit Points"
              fullWidth
              value={event.credit_points}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EventDetailPage;