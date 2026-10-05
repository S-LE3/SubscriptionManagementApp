/* eslint-disable prettier/prettier */
const express = require('express');
const app = express();
const billingRoutes = require('./routes/billing.routes');
const webhookRoutes = require('./routes/webhook.routes');
const financialRoutes = require('./routes/financial.routes');

// Global Middlewares (Request Sanitization & Parsing)
app.use(
  express.json({
    verify: (req, res, buf) => {
      // if (req.originalUrl.includes('/webhook')) 
        {
        req.rawBody = buf;
      }
    }
  })
); // Captures the unmutated string buffer to verify Paystack signatures
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', billingRoutes);
app.use('/api/v1/webhook', webhookRoutes);
app.use('/api/v1/financial', financialRoutes);

// Health Check Route (Verifies MVP API connectivity)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Global Middlewares (Request Sanitization & Parsing)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route (Verifies MVP API connectivity)
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Explicit placeholder for sub-team routing registers
// app.use('/api/v1/auth', require('./routes/auth.routes'));

module.exports = app;
