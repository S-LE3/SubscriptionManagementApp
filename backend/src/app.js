const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(cors());

// Mount Team A Authentication Routes
app.use('/api/auth', authRoutes);

// Base route test
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Subscription Management API is running' });
});

module.exports = app;