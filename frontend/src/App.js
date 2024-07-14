import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Routes from './Routes';

const theme = createTheme({
  // Customize your theme here
  palette: {
    primary: {
      main: '#1976d2', // Example primary color
    },
    secondary: {
      main: '#dc004e', // Example secondary color
    },
  },
  spacing: 4, // Example spacing configuration
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className='App'>
          <Navbar />
          <Routes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
