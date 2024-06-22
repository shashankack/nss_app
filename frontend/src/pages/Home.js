import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router for navigation
import api from '../utils/api';

const fetchEvents = async (status) => {
  return await api.get(`/event?status=${status}`);
};

const fetchAttendedEvents = async () => {
  return await api.get('/volunteer/eventsAttended');
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const HomePage = () => {
  const [openEvents, setOpenEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', start_date_time: '', location: '', creditPoints: '' });
  const [selectedEvent, setSelectedEvent] = useState({});

  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const openData = await fetchEvents('Open');
        setOpenEvents(openData.data);
        const attendedData = await fetchAttendedEvents();
        setAttendedEvents(attendedData.data);
        const completedData = await fetchCompletedEvents(attendedData.data);
        setCompletedEvents(completedData);        
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCompletedEvents = async (attendedE) => {
    const completedData = await fetchEvents('Completed');
    return completedData.data.map(event => ({
      ...event,
      earned_points: attendedE.includes(event.id) ? event.credit_points : 0
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRowClick = (eventId) => {
    nav(`/event/${eventId}`);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setEditDialog(true);
  };

  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`);
      setOpenEvents(openEvents.filter(event => event.id !== eventId));
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const renderTable = (events) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Credit Points</TableCell>
            {value === 0 && <TableCell>Actions</TableCell>}
            {value === 1 && <TableCell>Earned Points</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} style={{ cursor: 'pointer' }}>
              <TableCell onClick={() => handleRowClick(event.id)}>{event.name}</TableCell>
              <TableCell onClick={() => handleRowClick(event.id)}>{event.description}</TableCell>
              <TableCell onClick={() => handleRowClick(event.id)}>{event.formatted_date}</TableCell>
              <TableCell onClick={() => handleRowClick(event.id)}>{event.formatted_time}</TableCell>
              <TableCell onClick={() => handleRowClick(event.id)}>{event.location}</TableCell>
              <TableCell onClick={() => handleRowClick(event.id)}>{event.credit_points}</TableCell>
              {value === 0 && (
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(event)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'rgb(198, 40, 40)' }} onClick={() => handleDelete(event.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
              {value === 1 && <TableCell>{event.earned_points}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseEditDialog = () => {
    setEditDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedEvent({ ...selectedEvent, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/event', newEvent);
      console.log('Event created successfully:', response.data);
      handleCloseDialog();
      // Optionally, refresh the event lists
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put(`/event/${selectedEvent.id}`, selectedEvent);
      console.log('Event updated successfully:', response.data);
      handleCloseEditDialog();
      // Optionally, refresh the event lists
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt:20, maxHeight:400 }}>
        <Tabs value={value} onChange={handleChange} aria-label="event tabs">
          <Tab label="Open Events" />
          <Tab label="Completed Events" />
        </Tabs>
        <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{mr:10}}>New Event</Button>
      </Box>
      <TabPanel value={value} index={0}>
        {openEvents && openEvents.length > 0 ? renderTable(openEvents) : <Typography>No Open Events</Typography>}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {completedEvents && completedEvents.length > 0 ? renderTable(completedEvents) : <Typography>No Completed Events</Typography>}
      </TabPanel>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new event, please fill out the form below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Event Name"
            type="text"
            fullWidth
            value={newEvent.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newEvent.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="instructions"
            label="Instructions"
            type="text"
            fullWidth
            value={newEvent.instructions}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="datetime"
            label="Date & Time"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newEvent.start_date_time}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={newEvent.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="creditPoints"
            label="Credit Points"
            type="number"
            fullWidth
            value={newEvent.creditPoints}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            type="text"
            fullWidth
            value={newEvent.duration}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit this event, please update the form below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Event Name"
            type="text"
            fullWidth
            value={selectedEvent.name}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={selectedEvent.description}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="instructions"
            label="Instructions"
            type="text"
            fullWidth
            value={selectedEvent.instructions}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="datetime"
            label="Date & Time"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedEvent.start_date_time}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={selectedEvent.location}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="creditPoints"
            label="Credit Points"
            type="number"
            fullWidth
            value={selectedEvent.creditPoints}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            type="text"
            fullWidth
            value={selectedEvent.duration}
            onChange={handleEditInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;
