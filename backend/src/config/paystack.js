/* eslint-disable prettier/prettier */
const axios = require('axios');

// Create a pre-configured, reusable secure Axios instance for Paystack [paystack.com]
const paystackInstance = axios.create({
  baseURL: 'https://api.paystack.co/',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY.trim()}`, // Automatically injects secret key [paystack.com]
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

module.exports = paystackInstance;