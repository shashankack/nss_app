import React, { useEffect, useState } from 'react';
import {
  InputAdornment , Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, Box, IconButton, Tab, Tabs, Tooltip, DialogContentText, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup';
import api from '../utils/api';
import VolunteerUploadPopup from './VolunteerUploadPopup';
import { useNavigate } from 'react-router-dom';
import EditVolunteerDialog from '../components/EditVolunteerDialog';
import Zoom from '@mui/material/Zoom';
import SearchIcon from '@mui/icons-material/Search';
import Papa from 'papaparse'; 

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [volunteerPopupdata, setVolunteerPopupdata] = useState({});
  const [volunteerDialogData, setVolunteerDialogData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [volunteerId, setVolunteerId] = useState(null);
  const [mode, setMode] = useState('create');
  const nav = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (result) => {
        const lines = result.data;
        if (lines.length === 0) return;
  
        const headers = lines[0];
        const jsonData = [];
  
        for (let i = 1; i < lines.length; i++) {
          const data = lines[i];
          if (data.length === headers.length) {
            let obj = {};
            let user_id = data[0]?.trim();
            
            if (user_id) {
              obj['user'] = user_id;
            } else {
              obj['user'] = {
                "username": data[1]?.trim(),
                "first_name": data[2]?.trim(),
                "last_name": data[3]?.trim(),
                "email": data[4]?.trim(),
                "blood_group": data[5]?.trim(),
                "gender": data[6]?.trim()
              };
            }
  
            obj['course'] = data[7]?.trim();
            obj['course_year'] = data[8]?.trim();
            obj['role'] = data[9]?.trim();
            jsonData.push(obj);
          }
        }
  
        api.post('/admin/volunteers/upload/', jsonData)
          .then((response) => {
            setVolunteerPopupdata(response.data);
            setUploadPopupOpen(true);
          })
          .catch((error) => {
            console.error("Error uploading data:", error);
          });
      },
      error: (error) => {
        console.error("Error reading file:", error);
      }
    });
  };
  
  const fetchVolunteers = () => {
    api.get('/admin/volunteers/')
      .then((response) => {
        setVolunteers(response.data);
        setFilteredVolunteers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching volunteers:", error);
      });
  };
  
  useEffect(() => {
    fetchVolunteers();
  
    api.get('admin/college-courses/')
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = volunteers.filter(volunteer =>
        volunteer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        volunteer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        volunteer.username.includes(searchQuery) ||
        volunteer.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVolunteers(filtered);
    } else {
      setFilteredVolunteers(volunteers);
    }
  }, [searchQuery, volunteers]);

  const handleOpen = () => {
    setVolunteerDialogData(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setVolunteerDialogData(null);
  };

  const handleRowClick = (volunteer) => {
    setOpen(true);
    setMode('edit');
    setVolunteerDialogData(volunteer);
  };

  const handleCloseDeleteDialog = () => {
    setVolunteerId(null);
    setDeleteDialog(false);
  };
    
  const handleDelete = (volunteer) => {
    setVolunteerId(volunteer.id);
    setDeleteDialog(true);
  }

  const handleConfirmDelete = () => {
    api.delete(`/admin/volunteer/${volunteerId}/`)
      .then(() => {
        setVolunteers(volunteers.filter(volunteer => volunteer.id !== volunteerId));
        setFilteredVolunteers(filteredVolunteers.filter(volunteer => volunteer.id !== volunteerId));
        handleCloseDeleteDialog();
      })
      .catch((error) => {
        // Handle error
      });
  };

  const closeUploadPopup = () => {
    setUploadPopupOpen(false);
    fetchVolunteers();
  };

  const onEditVolunteerSubmit = (data, id) => {
    let obj = {};

    obj['user'] = {
      "username": data['username'].trim(),
      "first_name": data['first_name'].trim(),
      "last_name": data['last_name'].trim(),
      "email": data['email'].trim(),
      "blood_group": data['blood_group'].trim(),
      "gender": data['gender'].trim()
    };
    obj['course'] = data['course'];
    obj['course_year'] = data['course_year'];
    obj['role'] = data['role'];
  
    if (id) {
      console.log("Update Volunteer");
      api.put(`/admin/volunteer/${id}/`, obj)
      .then((response) => {
        setVolunteers(volunteers.map(volunteer => volunteer.id === id ? response.data : volunteer));
        setFilteredVolunteers(filteredVolunteers.map(volunteer => volunteer.id === id ? response.data : volunteer));
        fetchVolunteers();
        setOpen(false);
      })
      .catch((error) => {
        // Handle error
      });
    } else {
      console.log("Create Volunteer");
      obj['user']['password'] = 'resetme';
      api.post('/admin/volunteers/', obj)
      .then((response) => {
        setVolunteers([...volunteers, response.data]);
        setFilteredVolunteers([...filteredVolunteers, response.data]);
        fetchVolunteers();
        setOpen(false);
      })
      .catch((error) => {
        // Handle error
      });
    }
  }

  // Define form validation schema using Yup
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    blood_group: Yup.string().required('Blood Group is required'),
    gender: Yup.string().required('Gender is required'),
    course: Yup.string().required('Course is required'),
    course_year: Yup.string().required('Course Year is required'),
    role: Yup.string().required('Role is required'),
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 50 }}>
      <Paper elevation={3} sx={{ width: '70%', padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Tabs value={0}>
            <Tab label="Manage Volunteers" />
          </Tabs>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 5 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by name or role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mr: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 2 }}>Add New</Button>
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="contained-button-file"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" component="span">Upload</Button>
            </label>
          </Box>
        </Box>
        <TableContainer 
          component={Paper}
          elevation={24}
          sx={{
            maxHeight: 400,
            overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' },
          }}>
          <Table stickyHeader>
            <TableHead sx={{ '& th': { backgroundColor: 'primary.main', color: 'white' } }}>
              <TableRow sx={{ backgroundColor: '#B0BEC5', color: '#fff' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVolunteers.map((volunteer) => (
                <Tooltip 
                arrow 
                title="Click to edit" 
                followCursor={true} 
                TransitionComponent={Zoom}
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [2, 14],
                        },
                      },
                    ],
                  },
                }}>
                <TableRow
                  key={volunteer.id}
                  onClick={() => handleRowClick(volunteer)}
                  sx={{ '&:hover': { backgroundColor: '#e0e0e0', cursor: 'pointer' } }}
                >
                  <TableCell>{volunteer.first_name}</TableCell>
                  <TableCell>{volunteer.last_name}</TableCell>
                  <TableCell>{volunteer.username}</TableCell>
                  <TableCell>{volunteer.email}</TableCell>
                  <TableCell>{volunteer.role}</TableCell>
                  <TableCell>

                      <IconButton edge="end" onClick={(event) => { event.stopPropagation(); handleDelete(volunteer); }}>
                        <DeleteIcon  style={{ color: "#d32f2f" }}/>
                      </IconButton>                    
                  </TableCell>
                </TableRow>
                </Tooltip>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <EditVolunteerDialog
        open={open}
        onClose={handleClose}
        onSubmit={onEditVolunteerSubmit}
        initialData={volunteerDialogData}
        mode={mode}
        validationSchema={validationSchema}
        courses={courses}
      />

      <Dialog
        open={deleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>{"Are you sure you want to delete this volunteer?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <VolunteerUploadPopup open={uploadPopupOpen} handleClose={closeUploadPopup} data={volunteerPopupdata} />
    </Box>
  );
};

export default ManageVolunteers;
