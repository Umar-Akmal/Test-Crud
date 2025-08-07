// src/redux/slices/uploadSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const url = import.meta.env.VITE_API_API_URL;
export const uploadFile = createAsyncThunk('upload/file', async (formData, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${url}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Upload failed');
    }
});
export const fetchFiles = createAsyncThunk('fetch/file', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${url}/fetch-upload`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'fetch failed');
    }
});

const uploadSlice = createSlice({
    name: 'upload',
    initialState: {
        status: 'idle',
        error: null,
        message: null,
        uploadData: []
    },
    reducers: {
        resetUpload: (state) => {
            state.status = 'idle';
            state.error = null;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchFiles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.uploadData = action.payload;
            })
            .addCase(fetchFiles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

    }
});

export const { resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
