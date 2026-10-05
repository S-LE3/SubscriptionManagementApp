const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(cors());
 // TODO : Implement CORS ALLOWLIST, ALLOW FRONTEND WITH PORT 5173,5174, 3000, AS WELL AS THE OFFICIAL WEBSITE LIKE
 // auth.com


// Mount Team A Authentication Routes
app.use('/api/v1/auth', authRoutes);

// Base route test
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Subscription Management API is running' });
});

module.exports = app;
