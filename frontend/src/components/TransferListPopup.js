import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, List, ListItem, ListItemText, Paper, Checkbox, Container,
    CircularProgress } from '@mui/material';
import api from '../utils/api';

const TransferListPopup = ({ open, onClose, eventId }) => {
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      api.get('college-volunteers/')
        .then(response => {
          const allVolunteers = response.data;
          api.get(`event/${eventId}/attended-volunteers/`)
            .then(response => {
              const attendedVolunteers = response.data;
              const leftVolunteers = allVolunteers.filter(volunteer => !attendedVolunteers.includes(volunteer));
              setLeft(leftVolunteers);
              setRight(attendedVolunteers);
            })
            .catch(error => console.error('Error fetching attended volunteers:', error));
        })
        .catch(error => console.error('Error fetching college volunteers:', error));
    }
  }, [open, eventId]);

  const handleSubmit = async () => {
    try {
        setLoading(true);
        await api.post(`event/${eventId}/mark-attendance/`, { volunteer_ids: right.map(v => parseInt(v.volunteer_id, 10)) });
        onClose();
    } catch (error) {
        setError(error);
    } finally {
        setLoading(false);
    }
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    handleTransfer(checked.filter(item => left.includes(item)), left, right, setLeft, setRight);
  };

  const handleCheckedLeft = () => {
    handleTransfer(checked.filter(item => right.includes(item)), right, left, setRight, setLeft);
  };

  const handleTransfer = (items, from, to, setFrom, setTo) => {
    setFrom(from.filter(item => !items.includes(item)));
    setTo([...to, ...items]);
    setChecked(checked.filter(item => !items.includes(item)));
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const customList = (items) => (
    <Paper>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value.volunteer_id}-label`;

          return (
            <ListItem
              key={value.volunteer_id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <Checkbox
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
              <ListItemText id={labelId} primary={value.first_name +" "+value.last_name} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Mark Attendance</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={5}>
            {customList(left)}
          </Grid>
          <Grid item xs={2}>
            <Grid container direction="column" alignItems="center">
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={checked.filter(item => left.includes(item)).length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={checked.filter(item => right.includes(item)).length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            {customList(right)}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="outlined"  color="primary" disabled={loading}>
          {loading? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
      {error && <div style={{color: 'ed'}}>{error.message}</div>}
    </Dialog>
  );
};

export default TransferListPopup;
