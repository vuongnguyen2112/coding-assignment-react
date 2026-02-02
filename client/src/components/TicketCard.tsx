import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Ticket } from '@acme/shared-models';
import { RootState } from '../store/store';

interface TicketCardProps {
    ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
    const navigate = useNavigate();
    const users = useSelector((state: RootState) => state.users.users);

    const assignee = users.find((user) => user.id === ticket.assigneeId);

    const handleClick = () => {
        navigate(`/tickets/${ticket.id}`);
    };

    return (
        <Card
            sx={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                },
            }}
            onClick={handleClick}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                        {ticket.description}
                    </Typography>
                    {ticket.completed ? (
                        <CheckCircleIcon color="success" />
                    ) : (
                        <RadioButtonUncheckedIcon color="action" />
                    )}
                </Box>

                <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                        label={ticket.completed ? 'Completed' : 'Incomplete'}
                        color={ticket.completed ? 'success' : 'default'}
                        size="small"
                    />
                    <Chip
                        label={assignee ? assignee.name : 'Unassigned'}
                        color={assignee ? 'primary' : 'default'}
                        size="small"
                        variant="outlined"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default TicketCard;
