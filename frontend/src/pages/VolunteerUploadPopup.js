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
    const { created_volunteers, errors } = data || {};
    const successCount = created_volunteers?.length || 0;
    const errorCount = errors?.length || 0;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {`${successCount} volunteers uploaded successfully and ${errorCount} volunteers failed`}
            </DialogTitle>
            <DialogContent>
                {errorCount > 0 ? (
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
                                        <TableCell>
                                            {error.user_data?.user?.username 
                                                ? `Username - ${error.user_data.user.username}` 
                                                : `UserId - ${error.user_data?.user}`
                                            }
                                        </TableCell>
                                        <TableCell>{error.errors}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No errors to display.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VolunteerUploadPopup;
