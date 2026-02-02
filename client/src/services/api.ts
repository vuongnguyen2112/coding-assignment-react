import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4200/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ticketsApi = {
    fetchAll: () => api.get('/tickets'),
    fetchById: (id: number) => api.get(`/tickets/${id}`),
    create: (description: string) => api.post('/tickets', { description }),
    assign: (ticketId: number, userId: number) => api.put(`/tickets/${ticketId}/assign/${userId}`),
    unassign: (ticketId: number) => api.put(`/tickets/${ticketId}/unassign`),
    complete: (ticketId: number) => api.put(`/tickets/${ticketId}/complete`),
    uncomplete: (ticketId: number) => api.delete(`/tickets/${ticketId}/complete`),
};

export const usersApi = {
    fetchAll: () => api.get('/users'),
    fetchById: (id: number) => api.get(`/users/${id}`),
};

export default api;
