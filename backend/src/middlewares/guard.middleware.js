/* eslint-disable no-console */
const Subscription = require('../models/Subscription');

const checkSubscription = async (req, res, next) => {
  try {
    // Ensure the user is authenticated first (req.user must be populated by auth middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        data: null
      });
    }

    // Fetch the subscription record for the logged-in user
    const targetProvider =
      req.headers['x-subscription-provider'] || 'premium_tier';
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      providerName: targetProvider
    });

    // Strict Guardrail: Check if subscription exists and is explicitly 'active'
    if (!subscription || subscription.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. An active subscription is required.',
        data: null
      });
    }

    // Optional Expiration Check (Ensures current period has not ended)
    if (
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd < new Date()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Your subscription has expired. Please renew.',
        data: null
      });
    }

    // Pass control to the next endpoint handler if they pass the check
    next();
  } catch (error) {
    console.error('Subscription verification middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error verifying subscription access.',
      data: null
    });
  }
};

module.exports = { checkSubscription };
