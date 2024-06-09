
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import {makeStyles} from '@mui/styles'
import {login} from '../utils/auth'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const Home = () => {

  const [users, setUsers] = useState([])

  api.get('/user/')
  .then (response => {
    setUsers(response.data);
  })
  .catch(error => {
    console.error();
  });

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  


  const rows = [
    {"username": "a", "email": "a@b.com", "gender": "M"},
    {"username": "b", "email": "a@bb.com", "gender": "M"},
    {"username": "c", "email": "a@bc.com", "gender": "F"}
  ];

  return (
    <div> 
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Username</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Gender</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <TableRow
              key={row.username}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">{row.username}</TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="center">{row.gender}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

export default Home;