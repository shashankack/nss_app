import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import api from '../utils/api';

const LeaderBoard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/leaderboard/'); // Replace with your API endpoint
                setData(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
            <Paper sx={{ width: '80%', padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Leaderboard
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Rank</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Total Credits</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.user_id}>
                                    <TableCell align="center">{row.rank}</TableCell>
                                    <TableCell align="center">{`${row.first_name} ${row.last_name}`}</TableCell>
                                    <TableCell align="center">{row.total_credits ?? '0'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default LeaderBoard;
