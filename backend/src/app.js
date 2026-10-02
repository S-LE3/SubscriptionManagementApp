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
