import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Link, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { setAccessToken, setRefreshToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/nss_logo.png";
import background from "../assets/login_bg.jpg";

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  blurContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '35em',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '40px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  },
  formContainer: {
    marginLeft: '20px',
    maxWidth: 'xs',
  },
  form: {
    width: '100%',
  },
  submit: {
    marginTop: '16px',
    width: '200px',
  },
  logo: {
    maxWidth: '300px',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'transparent', // Set background to transparent
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.7)',
      },
      '&:hover fieldset': {
        borderColor: '#fff',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff',
      },
      '& input': {
        color: '#fff',
        backgroundColor: 'transparent', // Ensure input background is transparent
      },
    },
    '& .MuiInputLabel-root': {
      color: '#fff',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#fff',
    },
  },
  errorMessage: {
    color: 'red',
    marginTop: '8px',
    animation: '$wobble 0.5s ease-in-out', // Apply the animation
  },
  '@keyframes wobble': {
    '0%': {
      transform: 'translateX(0)',
    },
    '15%': {
      transform: 'translateX(-10px) rotate(-5deg)',
    },
    '30%': {
      transform: 'translateX(10px) rotate(5deg)',
    },
    '50%': {
      transform: 'translateX(-10px) rotate(-5deg)',
    },
    '70%': {
      transform: 'translateX(10px) rotate(5deg)',
    },
    '100%': {
      transform: 'translateX(0)',
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMouseX(event.clientX - rect.left);
    setMouseY(event.clientY - rect.top);
  };

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
        setError('Invalid email or password');
      });
  };

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.blurContainer}>
        <img src={logo} alt="Logo" className={classes.logo} />
        <Container className={classes.formContainer}>
          <Typography component="h1" variant="h3" sx={{ textColor: 'white', fontWeight: 'bold' }}>
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
              autoComplete="off"
              autoFocus
              onChange={handleEmailChange}
              className={classes.textField}
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
              className={classes.textField}
            />
            {error && <Typography className={classes.errorMessage}>{error}</Typography>}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <Link
                href="#"
                variant="body2"
                sx={{
                  transition: 'all 0.3s ease',
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: 'rgba(25, 118, 210, 0.7)',
                    textShadow: '0 0 10px rgba(25, 118, 210, 0.8)',
                  },
                }}
                onClick={handleSnackbarOpen}
              >
                Forgot Password?
              </Link>
              <Button
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(0, 123, 255, 0.6), transparent)`,
                    pointerEvents: 'none',
                  },
                }}
                onMouseMove={handleMouseMove}
                type="submit"
                variant="outlined"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          Forgot Password will be added in the future :)
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Login;
