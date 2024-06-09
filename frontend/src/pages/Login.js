// Login.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import {makeStyles} from '@mui/styles'
import axios from 'axios';
import { setAccessToken, setRefreshToken } from '../utils/auth'
import { useNavigate  } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

}));
 
const Login = () => {
const classes = useStyles();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const nav = useNavigate();


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    axios.post(`http://localhost:8000/api/login/`, { "email": email, "password": password })
    .then((response) => {
        setAccessToken(response.data.access);
        setRefreshToken(response.data.refresh);
        nav('/');

    })
    .catch((error) => {
        setError('Invalid login credentials');
    });

  };


  return (
    <Container component="main" maxWidth="xs">
      <div>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
             autoComplete="email"
             autoFocus
            onChange={handleEmailChange}
            />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
            />
            {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Login;