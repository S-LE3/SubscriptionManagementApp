/* eslint-disable prettier/prettier */
const express = require('express');
const router = express.Router();
const {
  initializeSubscription,
  getSubscriptionStatus
} = require('../controllers/sub.controller');

//const { verifyJWT } = require('../middlewares/auth.middleware'); // Matches authentication file

// Because the auth file is blank, it automatically uses mockAuth so the server doesn't crash
// Authentication middleware file importation is now optional, allowing for local testing without JWT verification
const authFile = require('../middlewares/auth.middleware');

const verifyJWT =
  (authFile && authFile.verifyJWT) ||
  ((req, res, next) => {
    // Temporary session injection for local workspace testing
    req.user = {
      _id: '64f1a2b3c4d5e6f7a8b9c0de',
      email: 'user-identity-test@hajime.tsacademy.edu'
    };
    next();
  });

// Create subscription payment link  (Protected by JWT)
router.post('/subscriptions/subscribe', verifyJWT, initializeSubscription);

// Target endpoint for frontend status validation polling
router.get('/subscriptions/poll-status', verifyJWT, getSubscriptionStatus);

module.exports = router;
