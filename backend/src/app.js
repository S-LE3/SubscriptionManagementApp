const express = require("express");
const app = express();

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
