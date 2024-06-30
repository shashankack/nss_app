import React, { useState, useEffect } from 'react';
import {
  Container, Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, TextField, IconButton, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';


const fetchEvents = async (status) => {
  return await api.get(`/event?status=${status}`);
};

const fetchAttendedEvents = async () => {
  return await api.get('/volunteer/eventsAttended');
};

const fetchUserRole = async () => {
  const response = await api.get('/loggedinuser/');
  return response.data.role
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  const [userRole, setUserRole] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    location: '',
    credit_points: '',
    instructions: '',
    duration: '',
  });
  const [selectedEvent, setSelectedEvent] = useState({});
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const nav = useNavigate();

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

  useEffect(() => {
    const initializeData = async () => {
      try {
        const role = await fetchUserRole();
        setUserRole(role);
        fetchData();
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    initializeData();
  }, []);

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
    return completedData.data.map((event) => ({
      ...event,
      earned_points: attendedE.includes(event.id) ? event.credit_points : 0,
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
      await api.delete(`/event/${eventId}/`);
      setOpenEvents(openEvents.filter((event) => event.id !== eventId));
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const renderTable = (events) => (
    <TableContainer
  component={Paper}
  elevation={24}
  sx={{
    maxHeight: 300,
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none'},
  }}
>
  <Table stickyHeader>
    <TableHead
      sx={{
        '& th': { backgroundColor: 'primary.main', color: 'white' },
      }}
    >
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Description</TableCell>
        <TableCell>Start Date</TableCell>
        <TableCell>Start Time</TableCell>
        <TableCell>Location</TableCell>
        <TableCell>Credit Points</TableCell>
        {value === 0 && userRole === "Leader" && <TableCell>Actions</TableCell>}
        {value === 1 && <TableCell>Earned Points</TableCell>}
      </TableRow>
    </TableHead>
    <TableBody>
      {events.slice().map((event) => (
        <TableRow
          key={event.id}
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => {
            if (!e.target.closest('IconButton')) {
              e.target.parentNode.style.backgroundColor = '#F2F3F4';
            }
          }}
          onMouseLeave={(e) => {
            e.target.parentNode.style.backgroundColor = 'inherit';
          }}
        >
          <TableCell onClick={() => handleRowClick(event.id)}><Typography>{event.name}</Typography></TableCell>
          <TableCell onClick={() => handleRowClick(event.id)}>{event.description}</TableCell>
          <TableCell onClick={() => handleRowClick(event.id)}>{format(new Date(event.start_datetime), 'dd/MM/yyyy')}</TableCell>
          <TableCell onClick={() => handleRowClick(event.id)}>{format(new Date(event.start_datetime), 'hh:mm a')}</TableCell>
          <TableCell onClick={() => handleRowClick(event.id)}>{event.location}</TableCell>
          <TableCell onClick={() => handleRowClick(event.id)}>{event.credit_points}</TableCell>
          {value === 0 && userRole === "Leader" && (
            <TableCell>
              <IconButton color="primary" onClick={() => handleEdit(event)}>
                <EditIcon sx={{ mt: -2, mb: -2 }} />
              </IconButton>
              <IconButton
                sx={{ color: 'rgb(198, 40, 50)' }}
                onClick={() => handleDelete(event.id)}
              >
                <DeleteIcon sx={{ mt: -2, mb: -2 }} />
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

  const validateForm = (event) => {
    const newErrors = {};
    if (!event.name) newErrors.name = 'Event name is required';
    if (!event.description) newErrors.description = 'Event description is required';
    if (!event.start_datetime) newErrors.start_datetime = 'Start date is required';
    if (!event.end_datetime) newErrors.end_datetime = 'Start time is required';
    if (!event.location) newErrors.location = 'Event location is required';
    if (!event.credit_points) newErrors.credit_points = 'Credit points are required';
    if (!event.instructions) newErrors.instructions = 'Instructions are required';
    if (!event.duration) newErrors.duration = 'Duration is required';

    return newErrors;
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const handleCloseEditDialog = () => {
    setEditDialog(false);
    setEditErrors({});
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
    const newErrors = validateForm(newEvent);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      fetchData();
      return;
    }

    try {
      const response = await api.post('/event/', newEvent);
      fetchData();
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
      const response = await api.put(`/event/${selectedEvent.id}/`, selectedEvent);
      console.log('Event updated successfully:', response.data);
      handleCloseEditDialog();
      fetchData();
      // Optionally, refresh the event lists
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return(
    <Container>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 20,
          borderRadius:2
        }}>
        <Tabs value={value} onChange={handleChange} aria-label="event tabs">
          <Tab label="Open Events" />
          <Tab label="Completed Events" />
        </Tabs>
        {userRole === "Leader" && (
        <Button 
          variant="outlined"
          color="primary"
          onClick={handleOpenDialog}
          sx={{ mr: 10, transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: "#ffffff",
              transform: 'scale(1)',
            }, }}
          startIcon={<AddIcon/>}
        >
          New Event
        </Button>
        )}
      </Box>
      <TabPanel value={value} index={0}>
        {renderTable(openEvents)}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {renderTable(completedEvents)}
      </TabPanel>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>New Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details of the new event.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Event Name"
                type="text"
                fullWidth
                value={newEvent.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Event Description"
                type="text"
                fullWidth
                value={newEvent.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={6}>
              <Grid item>Start Date and Time</Grid>
              <TextField
                margin="dense"
                name="start_datetime"
                type="datetime-local"
                fullWidth
                value={newEvent.start_datetime}
                onChange={handleInputChange}
                error={!!errors.start_datetime}
                helperText={errors.start_datetime}
              />
            </Grid>
            <Grid item xs={6}>
            <Grid item>End Date and Time</Grid>
              <TextField
                margin="dense"
                name="end_datetime"
                type="datetime-local"
                fullWidth
                value={newEvent.end_datetime}
                onChange={handleInputChange}
                error={!!errors.end_datetime}
                helperText={errors.end_datetime}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="location"
                label="Event Location"
                type="text"
                fullWidth
                value={newEvent.location}
                onChange={handleInputChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="credit_points"
                label="Credit Points"
                type="number"
                fullWidth
                value={newEvent.credit_points}
                onChange={handleInputChange}
                error={!!errors.credit_points}
                helperText={errors.credit_points}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="duration"
                label="Duration"
                type="text"
                fullWidth
                value={newEvent.duration}
                onChange={handleInputChange}
                error={!!errors.duration}
                helperText={errors.duration}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="instructions"
                label="Instructions"
                type="text"
                multiline={true}
                fullWidth
                value={newEvent.instructions}
                onChange={handleInputChange}
                error={!!errors.instructions}
                helperText={errors.instructions}
              />
            </Grid>
          </Grid>
          </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error" variant="outlined" sx={{transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: "#ffffff",
                    transform: 'scale(1)',
              },}}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} 
          color="primary"
          variant="outlined"
          sx={{
            transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: "#ffffff",
                    transform: 'scale(1)',
              },
          }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb:2}}>
            Please edit the details of the event.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Event Name"
                type="text"
                fullWidth
                value={selectedEvent.name}
                onChange={handleEditInputChange}
                error={!!editErrors.name}
                helperText={editErrors.name}/>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Event Description"
                type="text"
                fullWidth
                value={selectedEvent.description}
                onChange={handleEditInputChange}
                error={!!editErrors.description}
                helperText={editErrors.description}/>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="start_datetime"
                label="Start Date and Time"
                type="datetime-local"
                fullWidth
                value={selectedEvent.start_datetime}
                onChange={handleEditInputChange}
                error={!!editErrors.start_datetime}
                helperText={editErrors.start_datetime}/>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="end_datetime"
                label="End Date and Time"
                type="datetime-local"
                fullWidth
                value={selectedEvent.end_datetime}
                onChange={handleEditInputChange}
                error={!!editErrors.end_datetime}
                helperText={editErrors.end_datetime}/>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="location"
                label="Event Location"
                type="text"
                fullWidth
                value={selectedEvent.location}
                onChange={handleEditInputChange}
                error={!!editErrors.location}
                helperText={editErrors.location}/>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="Status"
                label="Event Status"
                type="text"
                fullWidth
                value={selectedEvent.status}
                onChange={handleEditInputChange}
                error={!!editErrors.status}
                helperText={editErrors.status}/>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="credit_points"
                label="Credit Points"
                type="number"
                fullWidth
                value={selectedEvent.credit_points}
                onChange={handleEditInputChange}
                error={!!editErrors.credit_points}
                helperText={editErrors.credit_points}/>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="duration"
                label="Duration"
                type="text"
                fullWidth
                value={selectedEvent.duration}
                onChange={handleEditInputChange}
                error={!!editErrors.duration}
                helperText={editErrors.duration}/>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="instructions"
                label="Instructions"
                type="text"
                multiline={true}
                fullWidth
                value={selectedEvent.instructions}
                onChange={handleEditInputChange}
                error={!!editErrors.instructions}
                helperText={editErrors.instructions}/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="error" variant="outlined" sx={{transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: "#ffffff",
                    transform: 'scale(1)',
                  },}}>
            Cancel
          </Button>
          <Button
           onClick={handleEditSubmit}
           color="primary" variant="outlined"
           sx={{
                transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: "#ffffff",
                    transform: 'scale(1)',
              },}}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;
