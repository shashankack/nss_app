import React, { useState } from 'react';
import AttendancePopup from './AttendancePopup'; // Assuming you have a component for the attendance popup

const AttendancePopupContainer = ({ eventData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Button or link to trigger the popup */}
      <button onClick={togglePopup}>Mark Attendance</button>
      
      {/* AttendancePopup component with isOpen and togglePopup passed as props */}
      <AttendancePopup isOpen={isOpen} togglePopup={togglePopup} eventData={eventData} />
    </>
  );
};

export default AttendancePopupContainer;
