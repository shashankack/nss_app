import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    FormHelperText, 
    Collapse,
    Alert
} from '@mui/material';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const nav = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError('');

            api.post('/password-reset/', {'password': newPassword})
            .then((response) => {
              setSuccess(true);
              setTimeout(() => {
                nav(-1); // Navigate to the previous page after 2 seconds
            }, 2000);
              
            })
            .catch((error) => {
                setError('Error resetting password');
            })

        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30
            }}
        >
            <Paper sx={{ padding: 4, width: '400px' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Reset Password
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        required
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        required
                    />
                    {error && (
                        <FormHelperText error>{error}</FormHelperText>
                    )}
                    <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between'}}>
                        <Button
                            onClick={() => nav(-1)}
                            type="submit"
                            variant="outlined"
                            color="error"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                        >
                            Reset Password
                        </Button>
                    </Box>
                </form>
                <Collapse in={success}>
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Password reset successfully!
                    </Alert>
                </Collapse>
            </Paper>
        </Box>
    );
};

export default ResetPassword;
