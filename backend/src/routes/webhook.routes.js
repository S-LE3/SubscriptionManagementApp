/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const { handlePaystackWebhook } = require('../controllers/webhook.controller');

router.post('/paystack', handlePaystackWebhook);

module.exports = router;
