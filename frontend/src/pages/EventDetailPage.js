import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Avatar,
  TextField,
  Paper,
  Modal,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
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
  const [volunteers, setVolunteers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchAttendedVolunteers = async () => {
    try {
      const response = await api.get(`/event/${id}/attended-volunteers/`);
      setAttendedVolunteers(response.data);
    } catch (error) {
      console.error("Failed to fetch attended volunteers:", error);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const response = await api.get(`/volunteers/?event_id=${id}`);
      setVolunteers(response.data);
    } catch (error) {
      console.error("Failed to fetch volunteers:", error);
    }
  };

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

    fetchEventDetails();
    fetchComments();
    fetchAttendedVolunteers();
    fetchVolunteers();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      let newStatus;
      if (status === 'Open') {
        newStatus = 'In Progress';
      } else if (status === 'In Progress') {
        newStatus = 'Completed';
      }

      const response = await api.put(`/event/${id}/`, { status: newStatus });
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleVolunteerSelect = (volunteerId) => {
    setSelectedVolunteers((prevSelected) =>
      prevSelected.includes(volunteerId)
        ? prevSelected.filter((id) => id !== volunteerId)
        : [...prevSelected, volunteerId]
    );
  };

  const handleSubmitAttendance = async () => {
    try {
      await api.post(`/event/${id}/mark-attendance/`, { volunteer_ids: selectedVolunteers });
      setOpen(false);
      setSelectedVolunteers([]);
      fetchAttendedVolunteers();
      fetchVolunteers();
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const attendedVolunteerIds = new Set(attendedVolunteers.map(v => v.id));
  const filteredVolunteers = volunteers.filter((volunteer) =>
    (volunteer.first_name.toLowerCase().includes(search.toLowerCase()) ||
     volunteer.last_name.toLowerCase().includes(search.toLowerCase())) &&
    !attendedVolunteerIds.has(volunteer.id) // Exclude attended volunteers
  );

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

  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const groupedComments = groupCommentsByDate(comments);

  if (!event) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container
      style={{ maxWidth: '1390px' }}
      sx={{ backgroundColor: '#f5f5f5', padding: 3, borderRadius: 2, ml: 5, mt: 5, boxShadow: 10 }}>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4" sx={{ lineHeight: '1.2' }}>
          {event.name}
        </Typography>
        <Box display="flex" justifyContent="space-between" sx={{ marginTop: 1 }}>
          <Typography variant="subtitle1" color="primary">
            Credit Points: {event.credit_points} | Status: {status}
          </Typography>
          {userDetails.role === 'Leader' && (
            <Button
              variant="contained"
              onClick={handleStatusChange}
              disabled={status === 'Completed'}
            >
              {status === 'Open' ? 'Start Event' : status === 'In Progress' ? 'End Event' : 'Event Ended'}
            </Button>
          )}
        </Box>
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

      {/* Row 2: Description */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Description
        </Typography>
        <div dangerouslySetInnerHTML={{ __html: event.description }} />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
        Instructions to Volunteers
        </Typography>
        <div dangerouslySetInnerHTML={{ __html: event.instructions }} />
      </Box>

      <ImageCarousel></ImageCarousel>
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
        <Typography variant="h6" gutterBottom>
          Event Discussion Forum
        </Typography>
        <Box sx={{ height: '70%', overflowY: 'auto', padding: 1 }}>
          {Object.keys(groupedComments).map(date => (
            <Box key={date} sx={{ marginBottom: 2 }}>
              <Typography sx={{ textAlign: 'center' }}>{date}</Typography>
              {groupedComments[date].map(comment => (
                <Paper elevation={2} key={comment.id} sx={{ padding: 2, marginBottom: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                    <Avatar sx={{ marginRight: 2, bgcolor: 'primary.main' }}>{comment.first_name[0]}</Avatar>
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
          autoComplete="off"
          label="Add a comment"
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleCommentSubmit}
          fullWidth
        />
      </Box>

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
        
        <Box sx={{ height: '70%', overflowY: 'auto', padding: 5 }}>
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
                  marginBottom: 2,
                  borderRadius: 1,
                  boxShadow: 3,
                  transition: '0.5s',
                  '&:hover': {
                    boxShadow: 5,
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
        <Box sx={{ ml: 65, mt: 12 }}>
          {status === 'In Progress' && userDetails.role === 'Leader' ? (
            <Button variant="contained" onClick={handleOpen} disabled={false}>
              Mark Attendance
            </Button>
          ) : (
            <Button variant="contained" disabled>
              Mark Attendance
            </Button>
          )}
        </Box>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4, 
          borderRadius: 2, 
          width: 400,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <Typography variant="h6" gutterBottom>
            Mark Attendance
          </Typography>
          <TextField
            label="Search Volunteers"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {filteredVolunteers.map((volunteer) => (
              <FormControlLabel
                key={volunteer.id}
                control={
                  <Checkbox
                    checked={selectedVolunteers.includes(volunteer.id)}
                    onChange={() => handleVolunteerSelect(volunteer.id)}
                  />
                }
                label={`${volunteer.first_name} ${volunteer.last_name} (${volunteer.role})`}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button onClick={handleClose} sx={{ marginRight: 1 }}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitAttendance}>Submit</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default EventDetails;
