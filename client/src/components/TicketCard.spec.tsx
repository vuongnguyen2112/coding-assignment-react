import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TicketCard from './TicketCard';
import ticketsReducer from '../store/ticketsSlice';
import usersReducer from '../store/usersSlice';
import { Ticket, User } from '@acme/shared-models';

const mockTicket: Ticket = {
    id: 1,
    description: 'Test ticket description',
    assigneeId: 1,
    completed: false,
};

const mockUsers: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
];

interface RenderOptions {
    initialState?: any;
}

const renderWithProviders = (component: React.ReactElement, { initialState = {} }: RenderOptions = {}) => {
    const store = configureStore({
        reducer: {
            tickets: ticketsReducer,
            users: usersReducer,
        },
        preloadedState: {
            users: {
                users: mockUsers,
                loading: false,
                error: null,
            },
            ...initialState,
        },
    });

    return render(
        <Provider store={store}>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </Provider>
    );
};

describe('TicketCard', () => {
    it('renders ticket description correctly', () => {
        renderWithProviders(<TicketCard ticket={mockTicket} />);
        expect(screen.getByText('Test ticket description')).toBeInTheDocument();
    });

    it('displays assignee name when assigned', () => {
        renderWithProviders(<TicketCard ticket={mockTicket} />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('shows "Unassigned" when no assignee', () => {
        const unassignedTicket: Ticket = { ...mockTicket, assigneeId: null };
        renderWithProviders(<TicketCard ticket={unassignedTicket} />);
        expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });

    it('displays completion status chip', () => {
        renderWithProviders(<TicketCard ticket={mockTicket} />);
        expect(screen.getByText('Incomplete')).toBeInTheDocument();
    });

    it('displays completed status when ticket is completed', () => {
        const completedTicket: Ticket = { ...mockTicket, completed: true };
        renderWithProviders(<TicketCard ticket={completedTicket} />);
        expect(screen.getByText('Completed')).toBeInTheDocument();
    });
});
