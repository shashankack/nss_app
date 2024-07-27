import React, { useEffect, useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Box, IconButton, Grid,
  RadioGroup, FormControlLabel, Radio, Select, InputLabel, FormControl, FormLabel, Typography, Tooltip,
  Zoom
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../utils/api';
import VolunteerUploadPopup from './VolunteerUploadPopup'
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [volunteerPopupdata, setVolunteerPopupdata] = useState({});
  const nav = useNavigate();
  const [newVolunteer, setNewVolunteer] = useState({
    user: {
      first_name: "",
      last_name: "",
      username: "",
      password: "pleaseresetme",
      email: "",
      blood_group: "",
      gender: ""
    },
    course: "",
    course_year: "",
    role: "Volunteer"
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    blood_group: "",
    gender: "",
    course: "",
    course_year: ""
  });

  const resetForm = () => {
    setNewVolunteer({
      user: {
        first_name: "",
        last_name: "",
        username: "",
        password: "pleaseresetme",
        email: "",
        blood_group: "",
        gender: ""
      },
      course: "",
      course_year: "",
      role: "Volunteer"
    });
    setErrors({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      blood_group: "",
      gender: "",
      course: "",
      course_year: ""
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');

      const jsonData = [];

      for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        if (data.length === headers.length) {
          let obj = {};
          let user_id = data[0].trim();
          if (user_id){
            obj['user'] = user_id;
          }
          else {
            obj['user'] = {
              "username": data[1].trim(),
              "first_name": data[2].trim(),
              "last_name": data[3].trim(),
              "email": data[4].trim(),
              "blood_group": data[5].trim(),
              "gender": data[6].trim()
            };
          }
          obj['course'] = data[7].trim();
          obj['course_year'] = data[8].trim();
          obj['role'] = data[9].trim();
          jsonData.push(obj);
        }
      }

      api.post('/admin/volunteers/upload/', jsonData)
        .then((response) => {
          setVolunteerPopupdata(response.data)
          setUploadPopupOpen(true);

        })
        .catch((error) => {
          console.error();
        })
    };

    reader.readAsText(file);
  };

  const fetchVolunteers = () => {
    api.get('/admin/volunteers/')
      .then((response) => {
        setVolunteers(response.data);
        setFilteredVolunteers(response.data);
      })
      .catch(() => {
        console.error();
      });
  }

  useEffect(() => {
    fetchVolunteers();

    api.get('admin/college-courses/')
      .then((response) => {
        setCourses(response.data);
      })
      .catch(() => {
        // Handle error
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = volunteers.filter(volunteer =>
        volunteer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        volunteer.last_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVolunteers(filtered);
    } else {
      setFilteredVolunteers(volunteers);
    }
  }, [searchQuery, volunteers]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!newVolunteer.user.first_name) {
      newErrors.first_name = "First name is required";
      isValid = false;
    }

    if (!newVolunteer.user.last_name) {
      newErrors.last_name = "Last name is required";
      isValid = false;
    }

    if (!newVolunteer.user.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!newVolunteer.user.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newVolunteer.user.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!newVolunteer.user.blood_group) {
      newErrors.blood_group = <Typography style={{ color: "#d32f2f", fontSize: "0.75rem" }}>Blood Group is required</Typography>;
      isValid = false;
    }

    if (!newVolunteer.user.gender) {
      newErrors.gender = <Typography style={{ color: "#d32f2f", fontSize: "0.75rem" }}>Gender is required</Typography>;
      isValid = false;
    }

    if (!newVolunteer.course) {
      newErrors.course = <Typography style={{ color: "#d32f2f", fontSize: "0.75rem" }}>Course is required</Typography>;
      isValid = false;
    }

    if (!newVolunteer.course_year) {
      newErrors.course_year = "Course year is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVolunteer((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value
      }
    }));
    validateForm();
  };

  const handleRoleChange = (e) => {
    setNewVolunteer((prev) => ({
      ...prev,
      role: e.target.value
    }));
    validateForm();
  };

  const handleGenderChange = (e) => {
    setNewVolunteer((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        gender: e.target.value
      }
    }));
    validateForm();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const handleRowClick = (volunteerId) => {
    nav(`/admin/volunteer/${volunteerId}`);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    api.post('/admin/volunteers/', newVolunteer)
      .then((response) => {
        setVolunteers([...volunteers, response.data]);
        setFilteredVolunteers([...filteredVolunteers, response.data]);
        fetchVolunteers();
        setOpen(false);
      })
      .catch((error) => {
        // Handle error
      });
  };

  const handleDelete = (volunteerId) => {
    api.delete(`/admin/volunteer/${volunteerId}/`)
      .then(() => {
        setVolunteers(volunteers.filter(volunteer => volunteer.id !== volunteerId));
        setFilteredVolunteers(filteredVolunteers.filter(volunteer => volunteer.id !== volunteerId));
      })
      .catch((error) => {
        // Handle error
      });
  };

  const closeUploadPopup = () => {
    setUploadPopupOpen(false)
    fetchVolunteers();
  }

  return (
    <Container>
      <Box style={{ display: 'flex', alignItems: 'center', marginTop: '6em' }}>
        <Typography variant="h4">Manage Volunteers</Typography>
        <Tooltip title="Add a new volunteer" TransitionComponent={Zoom} followCursor={true}>
        <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginLeft: "40em" }}>Add New</Button>
        </Tooltip>
        <input
          accept=".csv"
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="contained-button-file">
        <Tooltip title="Upload a .csv file" TransitionComponent={Zoom} followCursor={true}>
          <Button variant="contained" component="span" style={{ marginLeft: '30px' }}>Upload</Button>
        </Tooltip>
        </label>
      </Box>
      <TableContainer
        component={Paper}
        elevation={24}
        sx={{
          maxHeight: 700,
          overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' },
        }}>
        <Table stickyHeader>
          <TableHead sx={{ '& th': { backgroundColor: 'primary.main', color: 'white' } }}>
            <TableRow sx={{ backgroundColor: '#B0BEC5', color: '#212121' }}>
              <TableCell sx={{ padding: '16px', fontWeight: 'bold' }} >First Name</TableCell>
              <TableCell sx={{ padding: '16px', fontWeight: 'bold' }} >Last Name</TableCell>
              <TableCell sx={{ padding: '16px', fontWeight: 'bold' }} >Role</TableCell>
              <TableCell style={{ width: '100px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {volunteers.map((volunteer) => (
              <TableRow
                key={volunteer.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  if (!e.target.closest('IconButton')) {
                    e.target.parentNode.style.backgroundColor = '#F2F3F4'
                  }
                }}
                onMouseLeave={(e) => { e.target.parentNode.style.backgroundColor = 'inherit'; }}>

                <TableCell onClick={() => handleRowClick(volunteer.id)}>{volunteer.first_name}</TableCell>
                <TableCell onClick={() => handleRowClick(volunteer.id)}>{volunteer.last_name}</TableCell>
                <TableCell onClick={() => handleRowClick(volunteer.id)}>{volunteer.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(volunteer.id)}>
                    <DeleteIcon style={{ color: 'rgb(198, 40, 50)', fontSize: 20 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth='lg'>
        <DialogTitle>Create New Volunteer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* First Name and Last Name */}
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                label="First Name"
                type="text"
                fullWidth
                name="first_name"
                value={newVolunteer.user.first_name}
                onChange={handleInputChange}
                error={Boolean(errors.first_name)}
                helperText={errors.first_name}
                InputProps={{
                  style: { borderColor: errors.first_name ? 'red' : '' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                required
                label="Last Name"
                type="text"
                fullWidth
                name="last_name"
                value={newVolunteer.user.last_name}
                onChange={handleInputChange}
                error={Boolean(errors.last_name)}
                helperText={errors.last_name}
                InputProps={{
                  style: { borderColor: errors.last_name ? 'red' : '' }
                }}
              />
            </Grid>
            {/* Username and Email */}
            <Grid item xs={4}>
              <TextField
                margin="dense"
                required
                label="Username"
                type="text"
                fullWidth
                name="username"
                value={newVolunteer.user.username}
                onChange={handleInputChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
                InputProps={{
                  style: { borderColor: errors.username ? 'red' : '' }
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl component="fieldset" margin="dense" error={Boolean(errors.gender)}>
                <FormLabel id="gender-radio-group">Gender</FormLabel>
                <RadioGroup
                  aria-labelledby="gender-radio-group"
                  row
                  name="gender"
                  required
                  value={newVolunteer.user.gender}
                  onChange={handleGenderChange}
                >
                  <FormControlLabel value="M" control={<Radio />} label="Male" />
                  <FormControlLabel value="F" control={<Radio />} label="Female" />
                  <FormControlLabel value="O" control={<Radio />} label="Other" />
                </RadioGroup>
                {errors.gender && <Typography color="error">{errors.gender}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                margin="dense"
                label="Email"
                type="email"
                required
                fullWidth
                name="email"
                value={newVolunteer.user.email}
                onChange={handleInputChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                InputProps={{
                  style: { borderColor: errors.email ? 'red' : '' }
                }}
              />
            </Grid>
            {/* Blood Group, Gender, and Course */}
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense" error={Boolean(errors.blood_group)}>
                <InputLabel>Blood Group</InputLabel>
                <Select
                  name="blood_group"
                  required
                  value={newVolunteer.user.blood_group}
                  onChange={handleInputChange}
                  inputProps={{ 'aria-label': 'Blood Group' }}
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                </Select>
                {errors.blood_group && <Typography color="error">{errors.blood_group}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense" error={Boolean(errors.course)}>
                <InputLabel>Course</InputLabel>
                <Select
                  name="course"
                  required
                  value={newVolunteer.course}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, course: e.target.value })}
                  inputProps={{ 'aria-label': 'Course' }}
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.course_name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.course && <Typography color="error">{errors.course}</Typography>}
              </FormControl>
            </Grid>
            {/* Course Year, Volunteering Year, and Role */}
            <Grid item xs={4}>
              <TextField
                margin="dense"
                label="Course Year"
                required
                type="text"
                fullWidth
                name="course_year"
                value={newVolunteer.course_year}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, course_year: e.target.value })}
                error={Boolean(errors.course_year)}
                helperText={errors.course_year}
                InputProps={{
                  style: { borderColor: errors.course_year ? 'red' : '' }
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="dense">
                <Select
                  value={newVolunteer.role}
                  onChange={handleRoleChange}
                  inputProps={{ 'aria-label': 'Role' }}
                >
                  <MenuItem value="Volunteer">Volunteer</MenuItem>
                  <MenuItem value="Leader">Leader</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <VolunteerUploadPopup open={uploadPopupOpen} handleClose={closeUploadPopup} data={volunteerPopupdata} />
    </Container>
  );
};

export default ManageVolunteers;
