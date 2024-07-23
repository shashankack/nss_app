import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import SideNavbar from './components/SideNavbar';
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

    components: {
      MuiCssBaseline: {
        styleOverrides: `
          ::-webkit-scrollbar {
            width: 12px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          * {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
          }
        `,
      },
    },
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
