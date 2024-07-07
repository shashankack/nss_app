import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '../utils/api';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);

  const fetchVolunteers = async (status) => {
    return await api.get(`/admin/volunteers/`);
  };


  useEffect(() => {
    // Replace with your actual API endpoint
    api.get('/admin/volunteers/')
      .then((response) => {
        setVolunteers(response.data);
      })
      .catch(() => {
        
      });

  }, []);

  return (
    <Container>
      <h1>Volunteer Management</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {volunteers.map((volunteer) => (
              <TableRow key={volunteer.id}>
                <TableCell>{volunteer.first_name}</TableCell>
                <TableCell>{volunteer.last_name}</TableCell>
                <TableCell>{volunteer.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default VolunteerManagement;
