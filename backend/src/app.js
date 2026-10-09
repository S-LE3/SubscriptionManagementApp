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

/* eslint-disable prettier/prettier */
const express = require('express');
const app = express();
const billingRoutes = require('./routes/billing.routes');

// Global Middlewares (Request Sanitization & Parsing)
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.includes('/webhook')) {
      req.rawBody = buf; 
    }
  }
})); //Captures the unmutated string buffer to verify Paystack signatures [paystack.com]
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', billingRoutes);

// Health Check Route (Verifies MVP API connectivity)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Explicit placeholder for sub-team routing registers
// app.use('/api/v1/auth', require('./routes/auth.routes'));

module.exports = app;
