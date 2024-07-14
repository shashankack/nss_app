import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AttendancePopup = ({ isOpen, togglePopup, eventData }) => {
  const [successMessage, setSuccessMessage] = useState('');

  const handleAttendanceSubmit = () => {
    // Handle attendance submission logic here
    // Example: Call an API to mark attendance

    // Assuming success, show success message
    setSuccessMessage('Attendance marked successfully!');
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    togglePopup(); // Close the popup after showing success message
  };

  return (
    <>
      {isOpen && (
        <div className="attendance-popup">
          {/* Popup content goes here */}
          <h2>Mark Attendance</h2>
          {/* Display event data */}
          <p>{eventData.title}</p>
          <p>{eventData.date}</p>

          {/* Button to submit attendance */}
          <button onClick={handleAttendanceSubmit}>Submit Attendance</button>

          {/* Snackbar for showing success message */}
          <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
              {successMessage}
            </MuiAlert>
          </Snackbar>
        </div>
      )}
    </>
  );
};

export default AttendancePopup;
