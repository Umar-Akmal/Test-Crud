import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = import.meta.env.VITE_API_API_URL;
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(`${url}/users`, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (userData, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(`${url}/users`, userData, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(`${url}/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { getState }) => {
    const { auth } = getState();
    await axios.delete(`${url}/users/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return id;
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex((user) => user._id === action.payload._id);
                state.users[index] = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            });
    }
});

export default userSlice.reducer;