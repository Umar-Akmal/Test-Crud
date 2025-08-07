import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import addressReducer from './addressSlice';
import uploadReducer from './uploadSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        address: addressReducer,
        upload: uploadReducer,
    }
});