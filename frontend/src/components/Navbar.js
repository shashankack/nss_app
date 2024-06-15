import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {  useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api'
import { clearTokens } from '../utils/auth'
import axios from 'axios';
import Badge from '@mui/material/Badge';
import GradeIcon from '@mui/icons-material/Grade';
import logo from '../assets/nss_logo.png';



function ResponsiveAppBar() {
  const location = useLocation();
  const isNotLoginPage = location.pathname != '/login';
  const nav = useNavigate();
    
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [firstName, setFirstName] = React.useState('');
  const [userProfile, setUserProfile] = React.useState({});


  const getInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.substring(0, 1).toUpperCase()}${lastName.substring(0, 1).toUpperCase()}`;
    }
    return '';
  };

  React.useEffect(() => {
    if (isNotLoginPage) {
      api.get('/loggedinuser/')
      .then (response => {
        setUserProfile(response.data);
        console.log(userProfile)
      })
      .catch(error => {
        console.error();
      });
    }
  }, [isNotLoginPage]);

  const handleOpenNavMenu = (event) => {
    console.log(userProfile)
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const goHome = () => {
    nav("/")
  }

  const handleProfileView = () => {
    nav("/profile");
  };
  const handleLogout = () => {
    handleCloseUserMenu();
    clearTokens();
    nav("/login");
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    isNotLoginPage && 
    <AppBar position="static">
    <Toolbar>
    <Box display="flex" alignItems="center">
      <IconButton
        size="large"
        edge="end"
        aria-label="company logo"
        aria-haspopup="true"
        color="inherit"
        onClick={goHome}
      >
        <Avatar
          src={logo} // URL of the logo image
          alt="NSS" // Alt text for accessibility
          variant="square" // Use square variant for logos
        />
      </IconButton>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ display: { xs: 'none', sm: 'block' }, ml: 2 }} // Adding margin-left to create space
      >
        National College Basavanagudi {userProfile.college}
      </Typography>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ display: { xs: 'none', sm: 'block' }, ml: 2 }} // Adding margin-left to create space
      >
       Volunteering Year : {userProfile.volunteering_year}
      </Typography>
    </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={userProfile.credits_earned} color="error">
            <GradeIcon />
          </Badge>
        </IconButton>

      </Box>
      <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userProfile.first_name + " " + userProfile.last_name} src="/static/images/avatar/2.jpg">{getInitials(userProfile.first_name, userProfile.last_name)}</Avatar> 
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem key="profile" onClick={handleProfileView}>
                  <Typography textAlign="center">My Profile</Typography>
                </MenuItem>
                <MenuItem key="logout" onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>

            </Menu>
          </Box>

    </Toolbar>
  </AppBar>
  );
}
export default ResponsiveAppBar;