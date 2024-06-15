import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
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
    // Add Earned Points column based on attendance
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
            {value === 1 && <TableCell>Earned Points</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} onClick={() => handleRowClick(event.id)} style={{ cursor: 'pointer' }}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{event.start_date}</TableCell>
              <TableCell>{event.start_time}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.credit_points}</TableCell>
              {value === 1 && <TableCell>{event.earned_points}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="event tabs">
          <Tab label="Open Events" />
          <Tab label="Completed Events" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {openEvents && openEvents.length > 0 ? renderTable(openEvents) : <Typography>No Open Events</Typography>}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {completedEvents && completedEvents.length > 0 ? renderTable(completedEvents) : <Typography>No Completed Events</Typography>}
      </TabPanel>
    </Container>
  );
};

export default HomePage;
