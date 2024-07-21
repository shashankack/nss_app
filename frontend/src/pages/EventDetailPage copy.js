import React, {useEffect, useState} from 'react'
import api from '../utils/api';
import { Tabs, Tab, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import EditEventDialog from './EditEventDialog';

function EventListPage() {
  // call API to get all events
  const [events, setEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [openEvents, setOpenEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchUserRole = async () => {
    const response = await api.get('/loggedinuser/');
    return response.data.role;
  };

  const fetchEvents = async (status) => {
    return await api.get(`/event?status=${status}`);
  };
  
  const fetchAttendedEvents = async () => {
    return await api.get('/volunteer/eventsAttended');
  };

  const fetchCompletedEvents = async (attendedE) => {
    const completedData = await fetchEvents('Completed');
    return completedData.data.map((event) => ({
      ...event,
      earned_points: attendedE.includes(event.id) ? event.credit_points : 0,
    }));
  };


  const fetchData = async () => {
    try {
      const openData = await fetchEvents('Open');
      setOpenEvents(openData.data);
      const attendedData = await fetchAttendedEvents();
      setAttendedEvents(attendedData.data);
      const completedData = await fetchCompletedEvents(attendedData.data);
      setCompletedEvents(completedData);
      console.log('Open', openEvents);
      console.log('Completed', completedEvents);
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

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
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
  setDeleteDialog(false)
};

const handleConfirmDelete = async () => {
  if (selectedEvent && selectedEvent.id) {
    try {
      await api.delete(`/event/${selectedEvent.id}/`);
      setOpenEvents(openEvents.filter((event) => event.id !== selectedEvent.id));
      console.log('Event deleted successfully');
    } catch (error) {
      console.error('Failed to delete event:', error);
    } finally {
      handleCloseDeleteDialog();
    }
  }
};

const renderTableColumns = () => {
    let columns = [
        { id: 'name', label: 'Name' },
        { id: 'start_date', label: 'Start Date' },
        { id: 'start_time', label: 'Start Time' },
        { id: 'location', label: 'Location' },
        { id: 'credit_points', label: 'Credit Points' }
    ];

    if (currentTab === 0 && userRole === 'Leader') {
        columns.push({ id: 'actions', label: 'Actions' });
    } else if (currentTab === 1) {
        columns.push({ id: 'earned_points', label: 'Earned Points' });
    }

    return columns;
};
  
  return (
    <div>
        <div>
            <Box sx={{ display: 'grid', gridTemplateRows: 'auto auto', gap: '10px', marginBottom: '10px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {userRole === 'Leader' && (
                        <Button variant="contained" color="primary" onClick={handleCreateEvent}>
                            Create Event
                        </Button>
                    )}
                </Box>
                <Box>
                    <Tabs value={currentTab} onChange={handleChangeTab}>
                        <Tab label="Open Events" />
                        <Tab label="Completed Events" />
                    </Tabs>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Credit Points</TableCell>
                            {currentTab === 0 && userRole === 'Leader' && <TableCell>Actions</TableCell>}
                            {currentTab === 1 && <TableCell>Earned Points</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(currentTab === 0 ? openEvents : completedEvents).map(event => (
                            <TableRow key={event.id}>
                                <TableCell>{event.name}</TableCell>
                                <TableCell>{new Date(event.start_datetime).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(event.start_datetime).toLocaleTimeString()}</TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>{event.credit_points}</TableCell>
                                {currentTab === 0 && userRole === 'Leader' && (
                                    <TableCell>
                                        <Button variant="contained" style={{padding:2, margin:5}} color="primary" onClick={() => handleEditEvent(event)}>Edit</Button>
                                        <Button variant="contained" style={{padding:2, margin:5}} color="error" onClick={() => handleDeleteEvent(event)}>Delete</Button>
                                    </TableCell>
                                )}
                                {currentTab === 1 && <TableCell>{event.earned_points}</TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <EditEventDialog
                open={editDialogOpen}
                onClose={handleCloseDialog}
                event={selectedEvent}
                fetchData={fetchData}
            />
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
        </div>


</div>
  )
}

export default EventListPage