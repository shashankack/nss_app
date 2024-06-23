import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { clearTokens } from '../utils/auth';
import Badge from '@mui/material/Badge';
import GradeIcon from '@mui/icons-material/Grade';
import logo from '../assets/nss_logo.png'; // Ensure this is a high-resolution image
import CreditIcon from '../assets/credits_earned_dark.png'
function ResponsiveAppBar() {
  const location = useLocation();
  const isNotLoginPage = location.pathname !== '/login';
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
      .then(response => {
        setUserProfile(response.data);
        console.log(userProfile);
      })
      .catch(error => {
        console.error();
      });
    }
  }, [isNotLoginPage]);

  const handleOpenNavMenu = (event) => {
    console.log(userProfile);
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const goHome = () => {
    nav("/");
  };

  const handleProfileView = () => {
    nav("/profile");
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    clearTokens();
    nav("/login");
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    isNotLoginPage && 
    <AppBar position="static" sx={{ height: 70 }}>
      <Toolbar>
        <Box display="flex" alignItems="center">
          <IconButton
            edge="end"
            aria-haspopup="true"
            color="inherit"
            onClick={goHome}
            sx={{
              '&:hover': {
                backgroundColor: 'Transparent', // disable hover effect
              },
            }}
          >
            <Avatar
              src={logo}
              alt="NSS"
              variant="square"
              sx={{ width: 65, height: 65, mt:.3, mr:5 }} // Adjust the size as needed
            />
          </IconButton>
          <Typography
            fontFamily='custom-font'
            fontSize = '1.5rem'
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, ml: 10, mt:.5 }}
          >
            {userProfile.college}
          </Typography>
          <Typography
            fontFamily='custom-font'
            fontSize='1.5rem'
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, ml: 20, mt:.5 }}
          >
            Volunteering Year: {userProfile.volunteering_year ? userProfile.volunteering_year.label : ''}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, mr:2, mt:.5 }}>
          <Tooltip title="Credit Points">
            <IconButton
              size="large"
              color="inherit">
              <Badge badgeContent={userProfile.credits_earned} color="error">
                <Avatar src={CreditIcon}/>
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open Settings">
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
