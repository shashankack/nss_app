import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { setAccessToken, setRefreshToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/nss_logo.png"

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    margin: 'auto',
    marginTop: '64px',
    borderRadius: '4px',
    width: '900px',
    height: '600px',
    padding: '5px',
    boxShadow: '4px 15px 150px rgba(0, 0, 0, 0.2)',
  },
  formContainer: {
    marginTop: '60px',
    maxWidth: 'xs',
  },
  form: {
    width: '100%',
  },
  submit: {
    marginTop: '16px',
    width: '200px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '4px 0 0 4px',
  },
}));

const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/login/', { email, password })
      .then((response) => {
        setAccessToken(response.data.access);
        setRefreshToken(response.data.refresh);
        navigate('/');
      })
      .catch(() => {
        setError('Invalid login credentials');
      });
  };

  return (
    <Box className={classes.root} sx={{mt:16}}>
      <Box sx={{ flex: 1, mt:15, ml:6, mr:-10 }}>
        <img src={logo} alt="Login" width={350}/>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', mt:-4, mr:4 }}>
        <Container className={classes.formContainer}>
          <Typography component="h1" variant="h4">
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
            <Box display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
