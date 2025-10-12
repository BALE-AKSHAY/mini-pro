// server.js (CORRECT VERSION)
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Health check route (public)
app.get('/', (req, res) => {
    res.status(200).json({ status: 'active', message: 'Library API is running' });
});

// ✅ Route definitions - No global security middleware here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));