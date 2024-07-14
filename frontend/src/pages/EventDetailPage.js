import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box, Avatar, TextField, Accordion, Grid, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../utils/api';
import ImageCarousel from '../components/ImageCarousel';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/event/${id}/`);
        setEvent(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleStatusChange = () => {
    if (status === 'Upcoming') {
      setStatus('In progress');
    } else if (status === 'In progress') {
      setStatus('Completed');
    }
  };

  const handleCommentSubmit = (e) => {
    if (e.key === 'Enter' && newComment.trim()) {
      setComments([...comments, { user: 'User', text: newComment }]);
      setNewComment('');
    }
  };

  if (!event) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container sx={{ backgroundColor: '#f5f5f5', padding: 3, borderRadius: 2, ml: 20, mt: 5 }}>
      {/* Row 1: Header */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4" sx={{ lineHeight: '1.2' }}>
          {event.name}
        </Typography>
        <Box display="flex" justifyContent="space-between" sx={{ marginTop: 1 }}>
          <Typography variant="subtitle1" color="primary">
            Credit Points: {event.credit_points} | Status: {event.status}
          </Typography>
          <Button variant="contained" onClick={handleStatusChange}>
            {status === 'Upcoming' ? 'Start Event' : status === 'In progress' ? 'Complete Event' : 'Event Completed'}
          </Button>
        </Box>
      </Box>

      {/* Row 2: Description */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Description
        </Typography>
        <div dangerouslySetInnerHTML={{ __html: event.description }} />
      </Box>

      {/* Row 3: Compact Schedule */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Schedule
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Location:</strong> {event.location} | <strong> Date/Time:</strong> {new Date(event.start_datetime).toLocaleString()} | <strong> Duration:</strong> {event.duration}
        </Typography>
      </Box>

      {/* Row 4: Instructions */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Instructions to Volunteers
        </Typography>
        <Typography variant="body1">{event.instructions}</Typography>
      </Box>

      {/* Divider */}
      <Box sx={{ borderTop: '1px solid #ccc', marginBottom: 2 }} />

      {/* Row 6: Comments Widget */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 600,
          height: 340,
          border: '1px solid #ccc',
          borderRadius: 2,
          padding: 1,
          backgroundColor: '#fff',
          boxShadow: 10,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <Box sx={{ height: '70%', overflowY: 'auto', padding: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {comments.map((comment, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                <Avatar sx={{ marginRight: 1 }}>{comment.user[0]}</Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{comment.user}</Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <TextField
          label="Add a comment"
          variant="outlined"
          fullWidth
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          onKeyDown={handleCommentSubmit} // Submit on Enter
          sx={{ marginTop: 1 }}
        />
      </Box>

      {/* Row 7: Event Gallery */}
      <Box sx={{ marginBottom: 2 }}>
        <Accordion sx={{ marginBottom: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" gutterBottom>
              Event Gallery
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ImageCarousel />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default EventDetails;
