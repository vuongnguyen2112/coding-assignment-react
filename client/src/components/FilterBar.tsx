import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../store/ticketsSlice';
import { RootState } from '../store/store';

const FilterBar: React.FC = () => {
    const dispatch = useDispatch();
    const filter = useSelector((state: RootState) => state.tickets.filter);

    const handleChange = (_event: React.SyntheticEvent, newValue: 'all' | 'completed' | 'incomplete') => {
        dispatch(setFilter(newValue));
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={filter} onChange={handleChange} aria-label="ticket filter tabs">
                <Tab label="All" value="all" />
                <Tab label="Completed" value="completed" />
                <Tab label="Incomplete" value="incomplete" />
            </Tabs>
        </Box>
    );
};

export default FilterBar;
