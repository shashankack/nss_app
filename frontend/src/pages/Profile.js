
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
My Profile Page
    </div>
  );
}

export default Home;