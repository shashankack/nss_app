
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import {makeStyles} from '@mui/styles'
import {login} from '../utils/auth'
import {api} from '../utils/api'
import Navbar from './components/Navbar'
const Home = () => {



  return (
    <div> 
      <Navbar/>
      Home Page
    </div>
  );
}

export default Home;