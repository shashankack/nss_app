import React, { useEffect, useState } from 'react';
import { 
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Box, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ManageVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const nav = useNavigate();
  const [newVolunteer, setNewVolunteer] = useState({
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
    volunteering_year: "",
    role: "Volunteer"
  });

  useEffect(() => {
    api.get('/admin/volunteers/')
      .then((response) => {
        setVolunteers(response.data);
      })
      .catch(() => {
        
      });
    api.get('admin/college-courses/')
      .then((response) => {
        setCourses(response.data);
      })
      .catch(() => {
        
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVolunteer((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value
      }
    }));
  };

  const handleRoleChange = (e) => {
    setNewVolunteer((prev) => ({
      ...prev,
      role: e.target.value
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowClick = (volunteerId) => {
    nav(`/admin/volunteer/${volunteerId}`);
  }

  const handleSubmit = () => {
    api.post('/admin/volunteers/', newVolunteer)
      .then((response) => {
        setVolunteers([...volunteers, response.data]);
        setOpen(false);
      })
      .catch((error) => {
        
      });
  };

  const handleDelete = (volunteerId) => {
    api.delete(`/admin/volunteers/${volunteerId}/`)
      .then(() => {
        setVolunteers(volunteers.filter(volunteer => volunteer.id !== volunteerId));
      })
      .catch((error) => {
        
      });
  };

  return (
    <Container>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10em' }}>
        <h1>Volunteer Management</h1>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create Volunteer
        </Button>
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
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Role</TableCell>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Volunteer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            name="first_name"
            value={newVolunteer.user.first_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            name="last_name"
            value={newVolunteer.user.last_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            name="username"
            value={newVolunteer.user.username}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={newVolunteer.user.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Blood Group"
            type="text"
            fullWidth
            name="blood_group"
            value={newVolunteer.user.blood_group}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Gender"
            type="text"
            fullWidth
            name="gender"
            value={newVolunteer.user.gender}
            onChange={handleInputChange}
          />
          <TextField
            select
            label="Course"
            fullWidth
            value={newVolunteer.course}
            onChange={(e) => setNewVolunteer({ ...newVolunteer, course: e.target.value })}
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.course_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Course Year"
            type="text"
            fullWidth
            name="course_year"
            value={newVolunteer.course_year}
            onChange={(e) => setNewVolunteer({ ...newVolunteer, course_year: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Volunteering Year"
            type="text"
            fullWidth
            name="volunteering_year"
            value={newVolunteer.volunteering_year}
            onChange={(e) => setNewVolunteer({ ...newVolunteer, volunteering_year: e.target.value })}
          />
          <TextField
            select
            label="Role"
            fullWidth
            value={newVolunteer.role}
            onChange={handleRoleChange}
          >
            <MenuItem value="Volunteer">Volunteer</MenuItem>
            <MenuItem value="Leader">Leader</MenuItem>
          </TextField>
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
    </Container>
  );
};

export default ManageVolunteers;
