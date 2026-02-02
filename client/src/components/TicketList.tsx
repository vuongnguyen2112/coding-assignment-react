import React, { useEffect, useRef } from 'react';
import { Container, Fab, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, selectFilteredTickets } from '../store/ticketsSlice';
import { fetchUsers } from '../store/usersSlice';
import { RootState, AppDispatch } from '../store/store';
import TicketCard from './TicketCard';
import FilterBar from './FilterBar';
import LoadingSpinner from './LoadingSpinner';

const TicketList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const hasFetched = useRef(false);

    const filteredTickets = useSelector(selectFilteredTickets);
    const loading = useSelector((state: RootState) => state.tickets.loading);
    const usersLoading = useSelector((state: RootState) => state.users.loading);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            dispatch(fetchTickets());
            dispatch(fetchUsers());
        }
    }, [dispatch]);

    const handleAddClick = () => {
        navigate('/add');
    };

    if (loading || usersLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Ticket Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage and track your tickets
                </Typography>
            </Box>

            <FilterBar />

            {filteredTickets.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary">
                        No tickets found
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        },
                        gap: 3,
                    }}
                >
                    {filteredTickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </Box>
            )}

            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                }}
                onClick={handleAddClick}
            >
                <AddIcon />
            </Fab>
        </Container>
    );
};

export default TicketList;
