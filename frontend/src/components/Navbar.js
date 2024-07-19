import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { clearTokens } from '../utils/auth';
import Badge from '@mui/material/Badge';
import logo from '../assets/nss_logo.png';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function ResponsiveAppBar() {
  const location = useLocation();
  const isNotLoginPage = location.pathname !== '/login';
  const nav = useNavigate();
  
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [userProfile, setUserProfile] = React.useState({});


  React.useEffect(() => {
    if (isNotLoginPage) {
      api.get('/loggedinuser/')
        .then(response => {
          setUserProfile(response.data);
          localStorage.setItem('userDetails', JSON.stringify(response.data));
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [isNotLoginPage]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogout = () => {
    clearTokens();
    handleCloseUserMenu();
    nav("/login");
    
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    isNotLoginPage && (
      <AppBar position="sticky" sx={{ height: 70 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center">
            <IconButton edge="start" color="inherit" onClick={() => nav("/")}>
              <Avatar src={logo} alt="NSS" variant="square" sx={{ width: 60, height: 60 }} />
            </IconButton>
            <Typography fontFamily='custom-font' variant="h5" noWrap sx={{ ml: 2 }}>
              {userProfile.college}
            </Typography>
          </Box>

          <Typography fontFamily='custom-font' variant="h5" noWrap marginRight="40px">
            Volunteering Year: {userProfile.volunteering_year}
          </Typography>

          <Box display="flex" alignItems="center">
            <Typography fontFamily='custom-font' variant="h5" noWrap sx={{ mr: 2 }}>
              Role: {userProfile.role}
            </Typography>
            {userProfile.role != 'Admin' ? (
              <Tooltip title="Credit Points">
                <IconButton color="inherit" sx={{ mr: 2, ml: 20 }}>
                  <Badge badgeContent={''+userProfile.credits_earned} color="error">
                    <AutoAwesomeIcon style={{ fontSize: 40 }} />
                  </Badge>
                </IconButton>
              </Tooltip>
            ) : ''}
            <Tooltip title="Open Settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={`${userProfile.first_name} ${userProfile.last_name}`} src="/static/images/avatar/2.jpg">
                  {userProfile.first_name ? userProfile.first_name.charAt(0).toUpperCase() : ''}
                  {userProfile.last_name ? userProfile.last_name.charAt(0).toUpperCase() : ''}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              sx={{ mt: 2 }}
            >
              <MenuItem onClick={() => nav("/profile")}>
                <Typography textAlign="center">My Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    )
  );
}

export default ResponsiveAppBar;
