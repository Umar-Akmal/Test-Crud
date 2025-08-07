const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const addressRoutes = require('./routes/address');
const uploadRoutes = require('./routes/upload');
const cors = require('cors');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://194.195.115.208:3000'], // Frontend URL (Vite default)
    credentials: true // if you're sending cookies or auth headers
}));
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));