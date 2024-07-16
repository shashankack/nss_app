import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box, Avatar, TextField, Divider, Paper } from '@mui/material';
import api from '../utils/api';
import ImageCarousel from '../components/ImageCarousel';
import { format } from 'date-fns';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [attendedVolunteers, setAttendedVolunteers] = useState([]);

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

    const fetchComments = async () => {
      try {
        const response = await api.get(`/event/${id}/event-forum/`);
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    const fetchAttendedVolunteers = async () => {
      try {
        const response = await api.get(`/event/${id}/attended-volunteers/`);
        setAttendedVolunteers(response.data);
      } catch (error) {
        console.error("Failed to fetch attended volunteers:", error);
      }
    };

    fetchEventDetails();
    fetchComments();
    fetchAttendedVolunteers();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      let newStatus;
      if (status === 'Upcoming') {
        newStatus = 'In progress';
      } else if (status === 'In progress') {
        newStatus = 'Completed';
      }

      const response = await api.patch(`/event/${id}/`, { status: newStatus });
      setStatus(response.data.status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleCommentSubmit = async (event) => {
    if (event.key === 'Enter' && newComment) {
      try {
        const response = await api.post(`/event/${id}/event-forum/`, { comment: newComment });
        setComments([...comments, response.data]);
        setNewComment('');
      } catch (error) {
        console.error('Failed to submit comment:', error);
      }
    }
  };

  const groupCommentsByDate = (comments) => {
    return comments.reduce((groups, comment) => {
      const date = new Date(comment.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(comment);
      return groups;
    }, {});
  };

  const groupedComments = groupCommentsByDate(comments);

  if (!event) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container sx={{ backgroundColor: '#f5f5f5', padding: 3, borderRadius: 2, ml: 10, mt: 5, boxShadow: 10 }}>
      {/* Row 1: Header */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4" sx={{ lineHeight: '1.2' }}>
          {event.name}
        </Typography>
        <Box display="flex" justifyContent="space-between" sx={{ marginTop: 1 }}>
          <Typography variant="subtitle1" color="primary">
            Credit Points: {event.credit_points} | Status: {status}
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
          <strong>Location:</strong> {event.location} | <strong>Date/Time:</strong> {new Date(event.start_datetime).toLocaleString()} | <strong>Duration:</strong> {event.duration}
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
          right: 35,
          width: 450,
          height: 340,
          border: '1px solid #ccc',
          borderRadius: 2,
          padding: 1,
          backgroundColor: '#fff',
          boxShadow: 10,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Event Forum
        </Typography>
        <Box sx={{ height: '70%', overflowY: 'auto', padding: 1 }}>
          {Object.keys(groupedComments).map(date => (
            <Box key={date} sx={{ marginBottom: 2 }}>
              <Typography sx={{ textAlign: 'center' }}>{date}</Typography>
              {groupedComments[date].map(comment => (
                <Paper elevation={2} key={comment.id} sx={{ padding: 2, marginBottom: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                    <Avatar sx={{ marginRight: 2 }}>{comment.first_name[0]}</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {comment.first_name} {comment.last_name}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{comment.comment}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 80 }}>
                    {format(new Date(comment.created_at), 'hh:mm a')}
                  </Typography>
                </Paper>
              ))}
            </Box>
          ))}
        </Box>
        <TextField
          label="Add a comment"
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleCommentSubmit}
          fullWidth
        />
      </Box>

      {/* Row 5: Image Carousel */}
      <ImageCarousel />

      {/* Row 7: Attended Volunteers */}
      <Box
  sx={{
    position: 'fixed',
    bottom: 400,
    right: 35,
    width: 450,
    height: 475,
    border: '1px solid #ccc',
    borderRadius: 2,
    padding: 1,
    backgroundColor: '#fff',
    boxShadow: 10,
  }}
>
  <Typography variant="h5" gutterBottom>
    Attended Volunteers
  </Typography>
  <Box sx={{ height: '70%', overflowY: 'auto', padding: 1 }}>
    {attendedVolunteers.length === 0 ? (
      <Typography>No volunteers attended.</Typography>
    ) : (
      attendedVolunteers.map((volunteer) => (
        <Paper
          key={volunteer.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: 1,
            marginBottom: 1,
            borderRadius: 1,
            boxShadow: 1,
            transition: '0.3s',
            '&:hover': {
              boxShadow: 3,
            },
          }}
        >
          <Avatar sx={{ marginRight: 2, bgcolor: 'primary.main' }}>
            {volunteer.first_name[0]}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {volunteer.first_name} {volunteer.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {volunteer.role}
            </Typography>
          </Box>
        </Paper>
      ))
    )}
  </Box>
</Box>
    </Container>
  );
};

export default EventDetails;
