import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, IconButton, Grid, TextField, Divider, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { createTheme } from "@mui/material/styles";
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML } from 'draft-js';
import { convertToRaw } from 'draft-js';
import { ContentState } from 'draft-js';

const fetchEvents = async (status) => {
  return await api.get(`/event?status=${status}`);
};

const fetchAttendedEvents = async () => {
  return await api.get('/volunteer/eventsAttended');
};

const myTheme = createTheme();

const fetchUserRole = async () => {
  const response = await api.get('/loggedinuser/');
  return response.data.role;
};

// TabPanel Component
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
  const [deleteDialog, setDeleteDialog] = useState(false);
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
  const [eventToDelete, setEventToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [selectedEventDescription, setSelectedEventDescription] = useState(null);
  const [selectedEventInstructions, setSelectedEventInstructions] = useState(null);

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

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const pad = (n) => n < 10 ? '0' + n : n;
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
    event.description = getContentStateAsString(event.description);
    event.instructions = getContentStateAsString(event.instructions);
    setSelectedEventDescription(event.description)
    setSelectedEventInstructions(event.instructions)
    setSelectedEvent(event);
    setEditDialog(true);
  };

/*   const handleDelete = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}/`);
      setOpenEvents(openEvents.filter((event) => event.id !== eventId));
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }; */

  const renderTable = (events) => (
    <TableContainer
      component={Paper}
      elevation={24}
      sx={{
        maxHeight: 300,
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Table stickyHeader>
        <TableHead sx={{ '& th': { backgroundColor: 'primary.main', color: 'white' } }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Credit Points</TableCell>
            {value === 0 && userRole === "Leader" && <TableCell>Actions</TableCell>}
            {value === 1 && <TableCell>Earned Points</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
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
              <TableCell onClick={() => handleRowClick(event.id)}><Typography noWrap="false">{event.name}</Typography></TableCell>
              <TableCell onClick={() => handleRowClick(event.id)}>{format(new Date(event.start_datetime), 'dd/MM/yyyy')}</TableCell>
              <TableCell onClick={() => handleRowClick(event.id)}>{format(new Date(event.start_datetime), 'hh:mm a')}</TableCell>
              <TableCell onClick={() => handleRowClick(event.id)}>{event.location}</TableCell>
              <TableCell onClick={() => handleRowClick(event.id)}>{event.credit_points}</TableCell>
              {value === 0 && userRole === "Leader" && (
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(event)}>
                    <EditIcon sx={{ mt: -2, mb: -2 }} />
                  </IconButton>
                  <IconButton sx={{ color: 'rgb(198, 40, 50)' }} onClick={() => handleOpenDeleteDialog(event.id)}>
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

  const handleOpenDeleteDialog = (eventId) => {
    setEventToDelete(eventId);
    setDeleteDialog(true);
  }

  const handleCloseDeleteDialog = () => {
    setEventToDelete(null);
    setDeleteDialog(false);
  }

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        await api.delete(`/event/${eventToDelete}/`);
        setOpenEvents(openEvents.filter((event) => event.id !== eventToDelete));
        console.log('Event deleted successfully');
      } catch (error) {
        console.error('Failed to delete event:', error);
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };
  
  const getContentStateAsString = (html) => {
    const blocksFromHTML = convertFromHTML(html);
    const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
    const rawContentState = convertToRaw(contentState);
    return JSON.stringify(rawContentState);
    };


  const handleCloseEditDialog = () => {
    setEditDialog(false);
    setEditErrors({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleEditorChange = (value, ) => {
    setNewEvent({ ...newEvent, description: stateToHTML(value.getCurrentContent())});
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedEvent({ ...selectedEvent, [name]: value });
  };

  const handleEditEditorChange = (value) => {
    setSelectedEvent({ ...selectedEvent, description: stateToHTML(value.getCurrentContent()) });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateForm(newEvent);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await api.post('/event/', newEvent);
      fetchData();
      console.log('Event created successfully:', response.data);
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

 
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const newEditErrors = validateForm(selectedEvent);
    if (Object.keys(newEditErrors).length > 0) {
      setEditErrors(newEditErrors);
      return;
    }

    try {
      const response = await api.put(`/event/${selectedEvent.id}/`, selectedEvent);
      fetchData();
      console.log('Event updated successfully:', response.data);
      handleCloseEditDialog();
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  if (loading) {
    return (
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh" >
        <CircularProgress />
      </Box>
    )
  }


  return (
    <Container>
      <Box sx={{ width: '97%', mt: 50 }}>
        <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary">
          <Tab label="Open Events" />
          <Tab label="Completed Events" />
          <Box sx={{ display: 'flex', ml: 'auto' }}>
            <Button variant="contained" onClick={handleOpenDialog} startIcon={<AddIcon />}>
              New Event
            </Button>
        </Box>
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {renderTable(openEvents)}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {renderTable(completedEvents)}
      </TabPanel>

      {/* New Event Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='lg'>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the following details to create a new event.
          </DialogContentText>
          <Grid container spacing={2} marginTop={2}>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Event Name"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="credit_points"
                label="Credit Points"
                type="number"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                error={!!errors.credit_points}
                helperText={errors.credit_points}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                name="start_datetime"
                label="Start Date"
                type="datetime-local"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                error={!!errors.start_datetime}
                helperText={errors.start_datetime}
                InputLabelProps={{
                  shrink: true, // This is necessary to keep the label visible when using datetime-local
                }}
                inputProps={{
                  placeholder: '',
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                name="end_datetime"
                label="End Date"
                type="datetime-local"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                error={!!errors.end_datetime}
                helperText={errors.end_datetime}
                InputLabelProps={{
                  shrink: true, // This is necessary to keep the label visible when using datetime-local
                }}
                inputProps={{
                  placeholder: '',
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                name="duration"
                label="Duration (in hours)"
                type="number"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                error={!!errors.duration}
                helperText={errors.duration}
              />
            </Grid>
            <Grid item xs={12}>
              <Box style={{ border: '1px solid black', padding: '8px' }}>
                <MUIRichTextEditor
                  label="Event Description"
                  onChange={handleEditorChange}
                  error={!!errors.description}
                  helperText={errors.description}
                />
                <Divider />
                <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                  Event Description...
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
            <Box style={{ border: '1px solid black', padding: '8px' }}>
                <MUIRichTextEditor
                  label="Instructions for volunteers..."
                  onChange={handleEditorChange}
                  error={!!errors.instructions}
                  helperText={errors.instructions}
                />
                <Divider />
                <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                  Instructions for volunteers...
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="location"
                label="Location"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Event</Button>
        </DialogActions>
      </Dialog>


      {/* Edit Event Dialog */}
      <Dialog open={editDialog} onClose={handleCloseEditDialog} maxWidth= 'lg'>
        <DialogTitle variant="h4">Edit Event</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please update the following details for the event.
            </DialogContentText>
            <Divider sx={{ borderColor: '#000000'}} />
            <Grid container spacing={2} marginTop={5}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Event Name"
                  fullWidth
                  variant="outlined"
                  value={selectedEvent.name}
                  onChange={handleEditInputChange}
                  error={!!editErrors.name}
                  helperText={editErrors.name}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="credit_points"
                  label="Credit Points"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={selectedEvent.credit_points}
                  onChange={handleEditInputChange}
                  error={!!editErrors.credit_points}
                  helperText={editErrors.credit_points}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="start_datetime"
                  label="Start Date"
                  type="datetime-local"
                  fullWidth
                  variant="outlined"
                  value={formatDateTimeLocal(selectedEvent.start_datetime)}
                  onChange={handleEditInputChange}
                  error={!!editErrors.start_datetime}
                  helperText={editErrors.start_datetime}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  margin="dense"
                  name="end_datetime"
                  label="End Date"
                  type="datetime-local"
                  fullWidth
                  variant="outlined"
                  value={formatDateTimeLocal(selectedEvent.end_datetime)}
                  onChange={handleEditInputChange}
                  error={!!editErrors.end_datetime}
                  helperText={editErrors.end_datetime}
                />
              </Grid>
              <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    name="duration"
                    label="Duration (in hours)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={selectedEvent.duration}
                    onChange={handleEditInputChange}
                    error={!!editErrors.duration}
                    helperText={editErrors.duration}
                  />
              </Grid>
              <Grid item xs={12}>
                <Box style={{ border: '1px solid grey', borderRadius: 5, padding: '8px' }}>
                  <MUIRichTextEditor
                    label="Event Description"
                    defaultValue={selectedEventDescription ? selectedEventDescription :  null}
                    onChange1={handleEditEditorChange}
                    error={!!editErrors.description}
                    helperText={editErrors.description}
                  />
                  <Divider />
                <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                  Event Description...
                </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
              <Box style={{ border: '1px solid grey', borderRadius: 5, padding: '8px' }}>
                  <MUIRichTextEditor
                    label="Instructions to volunteers..."
                    defaultValue={selectedEventInstructions ? selectedEventInstructions :  null}
                    onChange1={handleEditEditorChange}
                    error={!!editErrors.instructions}
                    helperText={editErrors.instructions}
                  />
                  <Divider />
                <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                  Instructions to volunteers...
                </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="location"
                  label="Location"
                  fullWidth
                  variant="outlined"
                  value={selectedEvent.location}
                  onChange={handleEditInputChange}
                  error={!!editErrors.location}
                  helperText={editErrors.location}
                />
              </Grid>
            </Grid>
          </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} variant='outlined' color='error'>Cancel</Button>
          <Button onClick={handleEditSubmit} variant='outlined' color='primary'>Update Event</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Event Dialog */}
      <Dialog open={deleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;
