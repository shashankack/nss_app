import * as React from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu, Avatar, Tooltip, MenuItem, Drawer, List, ListItem,
  ListItemText, Badge, ListItemIcon, Divider, useTheme,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

import logo from '../assets/nss_logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { clearTokens } from '../utils/auth';

function ResponsiveAppBar() {
  const location = useLocation();
  const isNotLoginPage = location.pathname !== '/login';
  const nav = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState({});

  const theme = useTheme();

  React.useEffect(() => {
    if (isNotLoginPage) {
      api
        .get('/loggedinuser/')
        .then((response) => {
          setUserProfile(response.data);
          localStorage.setItem('userDetails', JSON.stringify(response.data));
        })
        .catch((error) => {
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
    nav('/login');
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleNavigation = (path) => {
    nav(path);
    setDrawerOpen(false); // Close drawer after navigation
  };

  return (
    isNotLoginPage && (
      <>
        <AppBar position="sticky" sx={{ height: 70 }}>
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box display="flex" alignItems="center">
              <IconButton edge="start" color="inherit" onClick={handleOpenDrawer}>
                <Avatar src={logo} alt="NSS" variant="square" sx={{ width: 60, height: 60 }} />
              </IconButton>
              <Typography fontFamily="custom-font" variant="h5" noWrap sx={{ ml: 2 }}>
                {userProfile.college}
              </Typography>
            </Box>

            <Typography fontFamily="custom-font" variant="h5" noWrap marginRight="40px">
              Volunteering Year: {userProfile.volunteering_year}
            </Typography>

            <Box display="flex" alignItems="center">
              <Typography fontFamily="custom-font" variant="h5" noWrap sx={{ mr: 2 }}>
                Role: {userProfile.role}
              </Typography>
              {userProfile.role !== 'Admin' && (
                <Tooltip title="Credit Points">
                  <IconButton color="inherit" sx={{ mr: 2, ml: 20 }}>
                    <Badge badgeContent={'' + userProfile.credits_earned} color="error">
                      <AutoAwesomeIcon style={{ fontSize: 40 }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Open Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={`${userProfile.first_name} ${userProfile.last_name}`} src="/static/images/avatar/2.jpg">
                    {userProfile.first_name ? userProfile.first_name.charAt(0).toUpperCase() : ''}
                    {userProfile.last_name ? userProfile.last_name.charAt(0).toUpperCase() : ''}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} sx={{ mt: 2 }}>
                <MenuItem onClick={() => nav('/profile')}>
                  <Typography textAlign="center">My Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <div
          style={{
            position: 'fixed',
            width: 10,
            height: '100vh',
            left: 0,
            top: 0,
            zIndex: 1300, // Ensures it's above other components
          }}
          onMouseEnter={handleOpenDrawer}
        />

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          variant="persistent" // Persistent so it won't auto-close when not using toggle
          onMouseLeave={handleCloseDrawer}
          PaperProps={{
            sx: {
              width: 280,
              marginTop: 18,
              backgroundColor: theme.palette.background.primary,
              boxShadow: theme.shadows[5],
              borderRadius: 2,
            },
          }}
        >
          <Box sx={{ height: '100%', padding: 2 }} role="presentation">
            <List>
              <ListItem
                button
                onClick={() => handleNavigation('/')}
                sx={{
                  marginTop: 60, 
                  marginBottom: 1, // Add space between items
                  borderRadius: 1,
                  boxShadow: 3,
                  backgroundColor: theme.palette.grey[100],
                  '&:hover': {
                    backgroundColor: theme.palette.grey[300],
                    boxShadow: 6,
                  },
                }}
              >
                <ListItemIcon>
                  <HomeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6">Home</Typography>} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleNavigation('/admin/manage-volunteers')}
                hidden={userProfile.role !== 'Admin'}
                sx={{
                  marginBottom: 1, // Add space between items
                  borderRadius: 1,
                  boxShadow: 3,
                  backgroundColor: theme.palette.grey[100],
                  '&:hover': {
                    backgroundColor: theme.palette.grey[300],
                    boxShadow: 6,
                  },
                }}
              >
                <ListItemIcon>
                  <GroupsIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6">Volunteers</Typography>} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleNavigation('/events')}
                sx={{
                  marginBottom: 1, // Add space between items
                  borderRadius: 1,
                  boxShadow: 3,
                  backgroundColor: theme.palette.grey[100],
                  '&:hover': {
                    backgroundColor: theme.palette.grey[300],
                    boxShadow: 6,
                  },
                }}
              >
                <ListItemIcon>
                  <EventIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6">Events</Typography>} />
              </ListItem>
              <ListItem
                button
                onClick={() => handleNavigation('/leaderboard')}
                sx={{
                  marginBottom: 1, // Add space between items
                  borderRadius: 1,
                  boxShadow: 3,
                  backgroundColor: theme.palette.grey[100],
                  '&:hover': {
                    backgroundColor: theme.palette.grey[300],
                    boxShadow: 6,
                  },
                }}
              >
                <ListItemIcon>
                  <LeaderboardIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="h6">Leaderboard</Typography>} />
              </ListItem>
            </List>
            <Divider />
          </Box>
        </Drawer>
      </>
    )
  );
}

export default ResponsiveAppBar;
