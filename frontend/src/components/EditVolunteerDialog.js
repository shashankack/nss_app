/* https://github.com/jquense/yup/issues/2034 */
/* https://github.com/jquense/yup/pull/2038 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem, CircularProgress, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Sample data for demonstration purposes
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const coursesYears = [1, 2, 3, 4]; // Replace with API data if available
const roles = ["Volunteer", "Leader"];

const EditVolunteerDialog = ({ open, onClose, mode, initialData, onSubmit, courses }) => {
  const [isLoading, setIsLoading] = useState(false);
  const defaultCourseId = courses.length > 0 ? courses[0].id : '';

  const formik = useFormik({
    initialValues: {
      username: initialData?.username || '',
      email: initialData?.email || '',
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      gender: initialData?.gender || 'M',
      blood_group: initialData?.blood_group || 'A+',
      course_year: initialData?.course_year || 1,
      role: initialData?.role || 'Volunteer',
      course: initialData?.course || defaultCourseId, // use course id for initial value
    },
    validationSchema: Yup.object({
      username: Yup.string().max(100, 'Must be 100 characters or less').matches(/^[a-zA-Z0-9_]*$/, 'Username must be alphanumeric and can include undserscore').required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      first_name: Yup.string().max(100, 'Must be 100 characters or less').matches(/^[a-zA-Z\s]*$/, 'First Name must be alphabets and can include spaces').required('Required'),
      last_name: Yup.string().max(100, 'Must be 100 characters or less').matches(/^[a-zA-Z\s]*$/, 'Last Name must be alphabets and can include spaces').required('Required'),
      gender: Yup.string().oneOf(['M', 'F'], 'Invalid Gender').required('Required'),
      blood_group: Yup.string().oneOf(bloodGroups, 'Invalid Blood Group').required('Required'),
      course_year: Yup.number().oneOf(coursesYears, 'Invalid Course Year').required('Required'),
      role: Yup.string().oneOf(roles, 'Invalid Role').required('Required'),
      course: Yup.number().required('Required'),
    }),
    onSubmit: async (values) => {
      
      setIsLoading(true);
      try {
        if (initialData && initialData.id) {
          await onSubmit(values, initialData.id);
        } else {
          await onSubmit(values);
        }
        
        onClose();
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
      formik.setValues({
        username: initialData?.username || '',
        email: initialData?.email || '',
        first_name: initialData?.first_name || '',
        last_name: initialData?.last_name || '',
        gender: initialData?.gender || 'M',
        blood_group: initialData?.blood_group || 'A+',
        course_year: initialData?.course_year || 1,
        role: initialData?.role || 'Volunteer',
        course: initialData?.course || defaultCourseId, // use course id for initial value
      });
  }, [initialData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === 'edit' ? 'Edit Volunteer' : 'Create Volunteer'}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Line 1: First Name, Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
                fullWidth
                margin="normal"
              />
            </Grid>

            {/* Line 2: Username, Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
                margin="normal"
              />
            </Grid>

            {/* Line 3: Role, Blood Group, Gender */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="role-select">Role</InputLabel>
                <Select
                labelId="role-select"
                  name="role"
                  label="Role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.role && formik.errors.role && <div style={{ color: 'red' }}>{formik.errors.role}</div>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="role-select">Blood Group</InputLabel>
                <Select
                  name="blood_group"
                  labelId="role-select"
                  label="Blood Group"
                  value={formik.values.blood_group}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.blood_group && Boolean(formik.errors.blood_group)}
                >
                  {bloodGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.blood_group && formik.errors.blood_group && <div style={{ color: 'red' }}>{formik.errors.blood_group}</div>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl component="fieldset" margin="normal">
                <RadioGroup
                  name="gender"
                  label="Gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  row
                >
                  <FormControlLabel value="M" control={<Radio />} label="Male" />
                  <FormControlLabel value="F" control={<Radio />} label="Female" />
                </RadioGroup>
                {formik.touched.gender && formik.errors.gender && <div style={{ color: 'red' }}>{formik.errors.gender}</div>}
              </FormControl>
            </Grid>

            {/* Line 4: Course, Course Year */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="role-select">Course</InputLabel>
                <Select
                  name="course"
                  labelId="role-select"
                  label="Course"
                  value={formik.values.course}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.course && Boolean(formik.errors.course)}
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.course_name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.course && formik.errors.course && <div style={{ color: 'red' }}>{formik.errors.course}</div>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="role-select">Course Year</InputLabel>
                <Select
                  name="course_year"
                  labelId="role-select"
                  label="Course Year"
                  value={formik.values.course_year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.course_year && Boolean(formik.errors.course_year)}
                >
                  {coursesYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.course_year && formik.errors.course_year && <div style={{ color: 'red' }}>{formik.errors.course_year}</div>}
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVolunteerDialog;
