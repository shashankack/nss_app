import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box, 
    Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/node/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import {stateToHTML} from 'draft-js-export-html';
import { convertFromHTML } from 'draft-js';
import { convertToRaw } from 'draft-js';
import { ContentState } from 'draft-js';
import api from '../utils/api';

import MUIRichTextEditor  from 'mui-rte';

const EditEventDialog = ({ open, onClose, event, fetchData }) => {
    const [name, setName] = useState('');
    const [creditPoints, setCreditPoints] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [durationHours, setDurationHours] = useState(1);
    const [location, setLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [eventDescriptionDefault, setEventDescriptionDefault] = useState('');
    const [instructionsDefault, setInstructionsDefault] = useState('');

    const [isNewEvent, setIsNewEvent] = useState(true); // Track if it's a new event or editing existing
    const [eventId, setEventId] = useState(false); // Track if it's a new event or editing existing

    const getContentStateAsString = (html) => {
        const blocksFromHTML = convertFromHTML(html);
        const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        const rawContentState = convertToRaw(contentState);
        return JSON.stringify(rawContentState);
      };

    useEffect(() => {
        if (event) {
            setName(event.name || '');
            setCreditPoints(event.credit_points || '');
            setStartDate(event.start_datetime ? dayjs(event.start_datetime) : null);
            setEndDate(event.end_datetime ? dayjs(event.end_datetime) : null);
            setDurationHours(event.duration || 1);
            setLocation(event.location || '');
            setEventDescription(event.description || '');
            setInstructions(event.instructions || '');

            setEventDescriptionDefault(event.description ? getContentStateAsString(event.description): null);
            setInstructionsDefault(event.instructions ? getContentStateAsString(event.instructions): null);
            setEventId(event.id);
            setIsNewEvent(false);
        } else {
            resetForm();
        }
    }, [event]);

    const setEventDescriptionState = (data) => {
        const val = data.getCurrentContent();
        setEventDescription(stateToHTML(val));
    }
    const setInstructionsState = (data) => {
        const val = data.getCurrentContent()
        setInstructions(stateToHTML(val));
    }

    const resetForm = () => {
        setName('');
        setCreditPoints('');
        setStartDate(null);
        setEndDate(null);
        setDurationHours(1);
        setLocation('');
        setEventDescription('');
        setInstructions('');
        setIsNewEvent(true);
        setEventDescriptionDefault(null);
        setInstructionsDefault(null);
    };

    const handleSave = async () => {
        // Implement save logic here
        const eventData = {
            name,
            credit_points: creditPoints,
            start_datetime: startDate?.toISOString(), // Ensure startDate is not null
            end_datetime: endDate?.toISOString(), // Ensure endDate is not null
            duration: durationHours,
            location,
            description: eventDescription,
            instructions
        };
        if (eventId) {
            const response = await api.put(`/event/${eventId}/`, eventData);
        } else {
            const response = await api.post('/event/', eventData);
        }
        fetchData();
        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{isNewEvent ? 'Create New Event' : 'Edit Event'}</DialogTitle>
            <DialogContent>
      <Grid container spacing={2}>
        {/* Row 1 */}
        <Grid item xs={7}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            margin="dense"
            label="Credit Points"
            fullWidth
            type="number"
            value={creditPoints}
            onChange={(e) => setCreditPoints(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            margin="dense"
            label="Duration (in hours)"
            fullWidth
            type="number"
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
          />
        </Grid>

        {/* Row 2 */}
        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} margin="dense" fullWidth />}
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} margin="dense" fullWidth />}
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={4}>
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
              Event Description
            </Typography>
          <Box style={{ border: '1px solid black', padding: '8px' }}>
            <MUIRichTextEditor
              defaultValue={eventDescriptionDefault}
              onChange={setEventDescriptionState}
              controls={['title', 'bold', 'italic', 'underline', 'numberList', 'bulletList', 'strikethrough', 'link', 'undo', "quote",  'redo', "clear"]}
              label="Start Typing..."
            />
            <Box style={{  padding: '10px' }}><div /> </Box>
          </Box>
        </Grid>        
        <Grid item xs={12}>
        <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
              Instructions to Volunteers
            </Typography>
          <Box style={{ border: '1px solid black', padding: '8px' }}>
            <MUIRichTextEditor
              defaultValue={instructionsDefault}
              onChange={setInstructionsState}
              controls={['title', 'bold', 'italic', 'underline', 'numberList', 'bulletList', 'strikethrough', 'link', 'undo', "quote",  'redo', "clear"]}
              label="Start Typing..."
            />
            <Box style={{  padding: '10px' }}><div /> </Box>
          </Box>
        </Grid>
      </Grid>
    </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditEventDialog;
