import React, { useEffect, useRef } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    CircularProgress,
    Divider,
    SelectChangeEvent,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTicketById,
    assignTicket,
    unassignTicket,
    completeTicket,
    uncompleteTicket,
    clearCurrentTicket,
} from '../store/ticketsSlice';
import { RootState, AppDispatch } from '../store/store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LoadingSpinner from './LoadingSpinner';

const TicketDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const hasFetched = useRef(false);

    const ticket = useSelector((state: RootState) => state.tickets.currentTicket);
    const loading = useSelector((state: RootState) => state.tickets.loading);
    const actionLoading = useSelector((state: RootState) => state.tickets.actionLoading);
    const users = useSelector((state: RootState) => state.users.users);

    useEffect(() => {
        if (id && !hasFetched.current) {
            hasFetched.current = true;
            dispatch(fetchTicketById(Number(id)));
        }

        return () => {
            dispatch(clearCurrentTicket());
            hasFetched.current = false;
        };
    }, [dispatch, id]);

    const handleBack = () => {
        navigate('/');
    };

    const handleAssignChange = async (event: SelectChangeEvent<number | ''>) => {
        if (!ticket) return;

        const userId = event.target.value;

        if (userId === '') {
            await dispatch(unassignTicket(ticket.id));
        } else {
            await dispatch(assignTicket({ ticketId: ticket.id, userId: Number(userId) }));
        }
    };

    const handleToggleComplete = async () => {
        if (!ticket) return;

        if (ticket.completed) {
            await dispatch(uncompleteTicket(ticket.id));
        } else {
            await dispatch(completeTicket(ticket.id));
        }
    };

    if (loading || !ticket) {
        return <LoadingSpinner />;
    }

    const assignee = users.find((user) => user.id === ticket.assigneeId);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mb: 3 }}
                disabled={actionLoading}
            >
                Back to List
            </Button>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
                        Ticket Details
                    </Typography>
                    {ticket.completed ? (
                        <CheckCircleIcon color="success" fontSize="large" />
                    ) : (
                        <RadioButtonUncheckedIcon color="action" fontSize="large" />
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box mb={3}>
                    <Typography variant="overline" color="text.secondary">
                        Ticket ID
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        #{ticket.id}
                    </Typography>
                </Box>

                <Box mb={3}>
                    <Typography variant="overline" color="text.secondary">
                        Description
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {ticket.description}
                    </Typography>
                </Box>

                <Box mb={3}>
                    <Typography variant="overline" color="text.secondary" display="block" mb={1}>
                        Status
                    </Typography>
                    <Chip
                        label={ticket.completed ? 'Completed' : 'Incomplete'}
                        color={ticket.completed ? 'success' : 'default'}
                        icon={ticket.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box mb={3}>
                    <FormControl fullWidth disabled={actionLoading}>
                        <InputLabel id="assignee-label">Assign to</InputLabel>
                        <Select
                            labelId="assignee-label"
                            value={ticket.assigneeId || ''}
                            label="Assign to"
                            onChange={handleAssignChange}
                        >
                            <MenuItem value="">
                                <em>Unassigned</em>
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {assignee && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Currently assigned to: {assignee.name}
                        </Typography>
                    )}
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleToggleComplete}
                    disabled={actionLoading}
                    startIcon={
                        actionLoading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : ticket.completed ? (
                            <RadioButtonUncheckedIcon />
                        ) : (
                            <CheckCircleIcon />
                        )
                    }
                    color={ticket.completed ? 'inherit' : 'success'}
                >
                    {actionLoading
                        ? 'Processing...'
                        : ticket.completed
                            ? 'Mark as Incomplete'
                            : 'Mark as Complete'}
                </Button>
            </Paper>
        </Container>
    );
};

export default TicketDetails;
