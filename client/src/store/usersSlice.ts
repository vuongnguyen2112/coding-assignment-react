import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@acme/shared-models';
import { usersApi } from '../services/api';

interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
}

// Async thunks
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await usersApi.fetchAll();
        return response.data as User[];
    }
);

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            });
    },
});

export default usersSlice.reducer;
