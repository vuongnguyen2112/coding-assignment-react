import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../store/ticketsSlice';
import { RootState, AppDispatch } from '../store/store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TicketForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const actionLoading = useSelector((state: RootState) => state.tickets.actionLoading);

    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!description.trim()) {
            setError('Description is required');
            return;
        }

        try {
            await dispatch(createTicket(description)).unwrap();
            navigate('/');
        } catch (err) {
            setError('Failed to create ticket');
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mb: 3 }}
            >
                Back to List
            </Button>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create New Ticket
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setError('');
                        }}
                        error={!!error}
                        helperText={error}
                        disabled={actionLoading}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={actionLoading}
                        startIcon={actionLoading ? <CircularProgress size={20} /> : null}
                    >
                        {actionLoading ? 'Creating...' : 'Create Ticket'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default TicketForm;
