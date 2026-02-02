import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Ticket } from '@acme/shared-models';
import { ticketsApi } from '../services/api';

interface TicketsState {
    tickets: Ticket[];
    currentTicket: Ticket | null;
    loading: boolean;
    actionLoading: boolean;
    error: string | null;
    filter: 'all' | 'completed' | 'incomplete';
}

export const fetchTickets = createAsyncThunk(
    'tickets/fetchTickets',
    async () => {
        const response = await ticketsApi.fetchAll();
        return response.data as Ticket[];
    }
);

export const fetchTicketById = createAsyncThunk(
    'tickets/fetchTicketById',
    async (id: number) => {
        const response = await ticketsApi.fetchById(id);
        return response.data as Ticket;
    }
);

export const createTicket = createAsyncThunk(
    'tickets/createTicket',
    async (description: string, { dispatch }) => {
        const response = await ticketsApi.create(description);
        // Refetch all tickets after creation
        await dispatch(fetchTickets());
        return response.data as Ticket;
    }
);

export const assignTicket = createAsyncThunk(
    'tickets/assignTicket',
    async ({ ticketId, userId }: { ticketId: number; userId: number }, { dispatch }) => {
        await ticketsApi.assign(ticketId, userId);
        // Refetch ticket details after assignment (API returns 204)
        await dispatch(fetchTicketById(ticketId));
    }
);

export const unassignTicket = createAsyncThunk(
    'tickets/unassignTicket',
    async (ticketId: number, { dispatch }) => {
        await ticketsApi.unassign(ticketId);
        // Refetch ticket details after unassignment (API returns 204)
        await dispatch(fetchTicketById(ticketId));
    }
);

export const completeTicket = createAsyncThunk(
    'tickets/completeTicket',
    async (ticketId: number, { dispatch }) => {
        await ticketsApi.complete(ticketId);
        // Refetch ticket details after completion (API returns 204)
        await dispatch(fetchTicketById(ticketId));
    }
);

export const uncompleteTicket = createAsyncThunk(
    'tickets/uncompleteTicket',
    async (ticketId: number, { dispatch }) => {
        await ticketsApi.uncomplete(ticketId);
        // Refetch ticket details after uncompletion (API returns 204)
        await dispatch(fetchTicketById(ticketId));
    }
);

const initialState: TicketsState = {
    tickets: [],
    currentTicket: null,
    loading: false,
    actionLoading: false,
    error: null,
    filter: 'all',
};

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<'all' | 'completed' | 'incomplete'>) => {
            state.filter = action.payload;
        },
        clearCurrentTicket: (state) => {
            state.currentTicket = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all tickets
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tickets';
            })
            // Fetch single ticket
            .addCase(fetchTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTicket = action.payload;
            })
            .addCase(fetchTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch ticket';
            })
            // Create ticket
            .addCase(createTicket.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(createTicket.fulfilled, (state) => {
                state.actionLoading = false;
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.error.message || 'Failed to create ticket';
            })
            // Assign ticket
            .addCase(assignTicket.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(assignTicket.fulfilled, (state) => {
                state.actionLoading = false;
            })
            .addCase(assignTicket.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.error.message || 'Failed to assign ticket';
            })
            // Unassign ticket
            .addCase(unassignTicket.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(unassignTicket.fulfilled, (state) => {
                state.actionLoading = false;
            })
            .addCase(unassignTicket.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.error.message || 'Failed to unassign ticket';
            })
            // Complete ticket
            .addCase(completeTicket.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(completeTicket.fulfilled, (state) => {
                state.actionLoading = false;
            })
            .addCase(completeTicket.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.error.message || 'Failed to complete ticket';
            })
            // Uncomplete ticket
            .addCase(uncompleteTicket.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(uncompleteTicket.fulfilled, (state) => {
                state.actionLoading = false;
            })
            .addCase(uncompleteTicket.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.error.message || 'Failed to uncomplete ticket';
            });
    },
});

export const { setFilter, clearCurrentTicket } = ticketsSlice.actions;

// Selectors
export const selectFilteredTickets = (state: { tickets: TicketsState }) => {
    const { tickets, filter } = state.tickets;
    switch (filter) {
        case 'completed':
            return tickets.filter((ticket) => ticket.completed);
        case 'incomplete':
            return tickets.filter((ticket) => !ticket.completed);
        default:
            return tickets;
    }
};

export default ticketsSlice.reducer;
