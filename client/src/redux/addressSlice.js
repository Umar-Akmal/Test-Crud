import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = import.meta.env.VITE_API_API_URL;
export const fetchAddresses = createAsyncThunk('address/fetchAddresses', async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(`${url}/address`, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

export const addAddress = createAsyncThunk('address/addAddress', async (addressData, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(`${url}/address`, addressData, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

export const updateAddress = createAsyncThunk('address/updateAddress', async ({ id, addressData }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(`${url}/address/${id}`, addressData, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

export const deleteAddress = createAsyncThunk('address/deleteAddress', async (id, { getState }) => {
    const { auth } = getState();
    await axios.delete(`${url}/address/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return id;
});

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        address: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.address = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.address.push(action.payload);
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                const index = state.address.findIndex((user) => user._id === action.payload._id);
                state.address[index] = action.payload;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.address = state.address.filter((user) => user._id !== action.payload);
            });
    }
});

export default addressSlice.reducer;