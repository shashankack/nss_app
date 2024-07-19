import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';

const VolunteerUploadPopup = ({ open, handleClose, data }) => {
    const { created_volunteers, errors } = data;
    const successCount = created_volunteers? created_volunteers.length:0;
    const errorCount = errors ? errors.length:0;

    return (
        (open && <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {`${successCount} volunteers uploaded successfully and ${errorCount} volunteers failed`}
            </DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Error</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {errors.map((error, index) => (
                                <TableRow key={index}>
                                    <TableCell>{error.user_data.user.username ? 'Username - ': 'UserId - '}{error.user_data.user.username ? error.user_data.user.username : error.user_data.user}</TableCell>
                                    <TableCell>{error.errors}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>)
    );
};

export default VolunteerUploadPopup;
