import ticketsReducer, {
    setFilter,
    selectFilteredTickets,
    fetchTickets,
    createTicket,
} from './ticketsSlice';
import { Ticket } from '@acme/shared-models';

describe('ticketsSlice', () => {
    const initialState = {
        tickets: [] as Ticket[],
        currentTicket: null,
        loading: false,
        actionLoading: false,
        error: null,
        filter: 'all' as const,
    };

    it('should handle initial state', () => {
        expect(ticketsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setFilter', () => {
        const actual = ticketsReducer(initialState, setFilter('completed'));
        expect(actual.filter).toEqual('completed');
    });

    it('should handle fetchTickets.pending', () => {
        const actual = ticketsReducer(initialState, fetchTickets.pending('', undefined));
        expect(actual.loading).toEqual(true);
        expect(actual.error).toEqual(null);
    });

    it('should handle fetchTickets.fulfilled', () => {
        const tickets: Ticket[] = [
            { id: 1, description: 'Test 1', assigneeId: null, completed: false },
            { id: 2, description: 'Test 2', assigneeId: 1, completed: true },
        ];
        const actual = ticketsReducer(
            initialState,
            fetchTickets.fulfilled(tickets, '', undefined)
        );
        expect(actual.loading).toEqual(false);
        expect(actual.tickets).toEqual(tickets);
    });

    it('should handle createTicket.pending', () => {
        const actual = ticketsReducer(initialState, createTicket.pending('', 'test'));
        expect(actual.actionLoading).toEqual(true);
        expect(actual.error).toEqual(null);
    });

    describe('selectFilteredTickets', () => {
        const mockTickets: Ticket[] = [
            { id: 1, description: 'Test 1', assigneeId: null, completed: false },
            { id: 2, description: 'Test 2', assigneeId: 1, completed: true },
            { id: 3, description: 'Test 3', assigneeId: 2, completed: false },
        ];

        it('should return all tickets when filter is "all"', () => {
            const state = {
                tickets: {
                    tickets: mockTickets,
                    currentTicket: null,
                    loading: false,
                    actionLoading: false,
                    error: null,
                    filter: 'all' as const,
                },
            };
            const result = selectFilteredTickets(state);
            expect(result).toHaveLength(3);
        });

        it('should return only completed tickets when filter is "completed"', () => {
            const state = {
                tickets: {
                    tickets: mockTickets,
                    currentTicket: null,
                    loading: false,
                    actionLoading: false,
                    error: null,
                    filter: 'completed' as const,
                },
            };
            const result = selectFilteredTickets(state);
            expect(result).toHaveLength(1);
            expect(result[0].completed).toBe(true);
        });

        it('should return only incomplete tickets when filter is "incomplete"', () => {
            const state = {
                tickets: {
                    tickets: mockTickets,
                    currentTicket: null,
                    loading: false,
                    actionLoading: false,
                    error: null,
                    filter: 'incomplete' as const,
                },
            };
            const result = selectFilteredTickets(state);
            expect(result).toHaveLength(2);
            expect(result.every((t) => !t.completed)).toBe(true);
        });
    });
});
