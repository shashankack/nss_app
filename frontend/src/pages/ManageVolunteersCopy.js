import React, { useEffect, useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Box, IconButton, Grid,
  RadioGroup, FormControlLabel, Radio, Select, InputLabel, FormControl, FormLabel, Toolbar, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import VolunteerUploadPopup from './VolunteerUploadPopup';
import { useNavigate } from 'react-router-dom';

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [volunteerPopupdata, setVolunteerPopupdata] = useState({});
  const nav = useNavigate();

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
          if (user_id) {
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
          setVolunteerPopupdata(response.data);
          setUploadPopupOpen(true);

        })
        .catch((error) => {
          console.error();
        });
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
  };

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowClick = (volunteerId) => {
    nav(`/admin/volunteer/${volunteerId}`);
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
    setUploadPopupOpen(false);
    fetchVolunteers();
  };

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

  // Initialize Formik with initial values and validation
  const formik = useFormik({
    initialValues: {
      user: {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        blood_group: "",
        gender: ""
      },
      course: "",
      course_year: "",
      role: "Volunteer"
    },
    validationSchema,
    onSubmit: (values, {setSubmitting}) => {
      console.log("Submit button clicked");
    console.log("Form values:", values);
    if (!formik.isValid) {
      console.log("Form is not valid");
      return;
    }
      api.post('/admin/volunteers/', values)
        .then((response) => {
          setVolunteers([...volunteers, response.data]);
          setFilteredVolunteers([...filteredVolunteers, response.data]);
          fetchVolunteers();
          setOpen(false);
        })
        .catch((error) => {
          // Handle error
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <Container>
      <Box style={{ display: 'flex', alignItems: 'center', marginTop: '10em' }}>
        <Toolbar>Volunteers</Toolbar>

        <Button variant="contained" color="primary" onClick={handleOpen} style={{ margin: '30px' }}>Add New</Button>

        <input
          accept=".csv"
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span" style={{ margin: '30px' }}>Upload</Button>
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
              <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>First Name</TableCell>
              <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Last Name</TableCell>
              <TableCell sx={{ padding: '16px', fontWeight: 'bold' }}>Role</TableCell>
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
                    e.target.parentNode.style.backgroundColor = '#F2F3F4';
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
        <form onSubmit={formik.handleSubmit}>
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
                  name="user.first_name"
                  value={formik.values.user.first_name}
                  onChange={formik.handleChange}
                  error={formik.touched.user?.first_name && Boolean(formik.errors.user?.first_name)}
                  helperText={formik.touched.user?.first_name && formik.errors.user?.first_name}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  margin="dense"
                  label="Last Name"
                  type="text"
                  fullWidth
                  name="user.last_name"
                  value={formik.values.user.last_name}
                  onChange={formik.handleChange}
                  error={formik.touched.user?.last_name && Boolean(formik.errors.user?.last_name)}
                  helperText={formik.touched.user?.last_name && formik.errors.user?.last_name}
                />
              </Grid>
              {/* Username and Email */}
              <Grid item xs={6}>
                <TextField
                  required
                  margin="dense"
                  label="Username"
                  type="text"
                  fullWidth
                  name="user.username"
                  value={formik.values.user.username}
                  onChange={formik.handleChange}
                  error={formik.touched.user?.username && Boolean(formik.errors.user?.username)}
                  helperText={formik.touched.user?.username && formik.errors.user?.username}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  name="user.email"
                  value={formik.values.user.email}
                  onChange={formik.handleChange}
                  error={formik.touched.user?.email && Boolean(formik.errors.user?.email)}
                  helperText={formik.touched.user?.email && formik.errors.user?.email}
                />
              </Grid>
              {/* Blood Group and Gender */}
              <Grid item xs={6}>
              <FormControl fullWidth>
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    required
                    name="user.blood_group"
                    value={formik.values.user.blood_group}
                    onChange={formik.handleChange}
                    error={formik.touched.user?.blood_group && Boolean(formik.errors.user?.blood_group)}
                  >
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </Select>
                  {formik.touched.user?.blood_group && formik.errors.user?.blood_group && (
                    <Box color="red">{formik.errors.user?.blood_group}</Box>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    required
                    name="course"
                    value={formik.values.course}
                    onChange={formik.handleChange}
                    error={formik.touched.course && Boolean(formik.errors.course)}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}><Typography>{course.course_name} </Typography></MenuItem>
                    ))}
                  </Select>
                  {formik.touched.course && formik.errors.course && (
                    <Box color="red">{formik.errors.course}</Box>
                  )}
                </FormControl>
              </Grid>
              
              {/* Course and Year */}
              <Grid item xs={6}>
                <TextField
                  required
                  margin="dense"
                  label="Course Year"
                  type="number"
                  fullWidth
                  name="course_year"
                  value={formik.values.course_year}
                  onChange={formik.handleChange}
                  error={formik.touched.course_year && Boolean(formik.errors.course_year)}
                  helperText={formik.touched.course_year && formik.errors.course_year}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="user.gender"
                    value={formik.values.user.gender}
                    onChange={formik.handleChange}
                    row
                  >
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {/* Role */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                  >
                    <MenuItem value="Volunteer">Volunteer</MenuItem>
                    <MenuItem value="Leader">Leader</MenuItem>
                  </Select>
                  {formik.touched.role && formik.errors.role && (
                    <Box color="red">{formik.errors.role}</Box>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={formik.handleSubmit} variant="contained" color="primary">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
      <VolunteerUploadPopup open={uploadPopupOpen} onClose={closeUploadPopup} data={volunteerPopupdata} />
    </Container>
  );
}

export default ManageVolunteers;
