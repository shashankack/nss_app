import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  Tabs,
  Tab,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditEventDialog from '../components/EditEventDialog';

function EventListPage() {
  const navigate = useNavigate();
  const [openEvents, setOpenEvents] = useState([]);
  const [inProgressEvents, setInProgressEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [error, setError] = useState(null);
  
  
  const fetchUserRole = async () => {
    try {
      const response = await api.get('/loggedinuser/');
      return response.data.role;
    } catch (error) {
      setError('Failed to fetch user role. Please try again later.');
      throw error;
    }
  };

  const fetchEvents = async (status) => {
    try {
      const response = await api.get(`/event?status=${status}`);
      return response.data;
    } catch (error) {
      setError('Failed to fetch events. Please try again later.');
      throw error;
    }
  };

  const fetchAttendedEvents = async () => {
    try {
      const response = await api.get('/volunteer/events-attended');
      return response.data.map(event => event.id); // Return only event IDs
    } catch (error) {
      throw error;
    }
  };

  const fetchCompletedEvents = async (attendedEventIds) => {
    try {
      const completedData = await fetchEvents('Completed');
      return completedData.map((event) => ({
        ...event,
        earned_points: attendedEventIds.includes(event.id) ? event.credit_points : 0,
      }));
    } catch (error) {
      setError('Failed to fetch completed events. Please try again later.');
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      const openData = await fetchEvents('Open');
      setOpenEvents(openData);
      const inProgressData = await fetchEvents('In Progress');
      setInProgressEvents(inProgressData);
      const attendedEventIds = await fetchAttendedEvents();
      const completedData = await fetchCompletedEvents(attendedEventIds);
      setCompletedEvents(completedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentTab(parseInt(localStorage.getItem("currentEventTab")));
    const initializeData = async () => {
      try {
        const role = await fetchUserRole();
        setUserRole(role);
        await fetchData();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeData();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
    localStorage.setItem('currentEventTab', newValue)
  };

  const handleRowClick = (id) => {
    navigate(`/event/${id}`);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEditDialogOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setEditDialogOpen(true);
  };

  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
    setEditDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedEvent(null);
    setDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await api.delete(`/event/${selectedEvent.id}/`);
        setOpenEvents(openEvents.filter((event) => event.id !== selectedEvent.id));
      } catch (error) {
        setError('Failed to delete event. Please try again later.');
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 50 }}>
      <Paper elevation={3} sx={{ width: '70%', padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Tabs value={currentTab} onChange={handleChangeTab}>
            <Tab label="Open Events" />
            <Tab label="In Progress Events" />
            <Tab label="Completed Events" />
          </Tabs>
          <Button variant="contained" color="primary" onClick={handleCreateEvent} hidden={userRole === 'Volunteer'}>
            Create Event
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: 'none' }}>
          <Table>
            <TableHead sx={{ '& th': { backgroundColor: 'primary.main', color: 'white' } }}>
              <TableRow sx={{ backgroundColor: '#B0BEC5', color: '#212121' }}>
                <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Start Date</TableCell>
                <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Start Time</TableCell>
                <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Credit Points</TableCell>
                {currentTab === 0 && userRole !== 'Volunteer' && <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Actions</TableCell>}
                {currentTab === 1 && <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Actions</TableCell>}
                {currentTab === 2 && userRole !== 'Admin' && <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Earned Points</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {(currentTab === 0 ? openEvents : currentTab === 1 ? inProgressEvents : completedEvents).map(event => (
                <TableRow
                  key={event.id}
                  onClick={() => handleRowClick(event.id)}
                  onMouseEnter={() => setHoveredRow(event.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: hoveredRow === event.id ? '#e0e0e0' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    }
                  }}
                >
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{new Date(event.start_datetime).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(event.start_datetime).toLocaleTimeString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.credit_points}</TableCell>
                  {currentTab === 0 && userRole !== 'Volunteer' && (
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={(e) => { e.stopPropagation(); handleEditEvent(event); }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event); }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                  {currentTab === 1 && userRole !== 'Volunteer' && (
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={(e) => { e.stopPropagation(); handleEditEvent(event); }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event); }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                  {currentTab === 2 && userRole !== 'Admin' && <TableCell>{event.earned_points}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <EditEventDialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        event={selectedEvent}
        fetchData={fetchData}
      />
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
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EventListPage;
