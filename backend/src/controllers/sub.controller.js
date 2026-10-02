/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const Subscription = require('../models/Subscription');
const paystack = require('../config/paystack');

// Initialize Checkout Redirection Session
const initializeSubscription = async (req, res) => {
  try {
    const { planCode, couponCode, providerName } = req.body;
    const userId = req.user._id;
    const userEmail = req.user.email;

    const activeProvider = providerName || 'premium_tier';

    // Hardcoded placeholder calculation for the MVP
    const baseAmountUnits = 500000;

    const paystackPayload = {
      email: userEmail,
      amount: baseAmountUnits,
      plan: planCode || '', // It sends empty string if no planCode exists to bypass dashboard checks [paystack.com]
      metadata: {
        user_id: userId.toString(),
        coupon_applied: couponCode || 'none',
        provider_name: activeProvider
      }
    };

    const paystackResponse = await paystack.post('/transaction/initialize', paystackPayload);

    // Save or update user tracking state as 'pending' in MongoDB
    await Subscription.findOneAndUpdate(
      { userId: userId, providerName: providerName || 'premium_tier' },
      {
        status: 'pending',
        paystackSubscriptionCode: planCode
      },
      { upsert: true, returnDocument: 'after' }
    );

    // Returns the EXACT matching payload requested by the manual contract
    return res.status(200).json({
      success: true,
      message: 'Payment link generated successfully.',
      data: {
        authorization_url: paystackResponse.data.data.authorization_url,
        transaction_reference: paystackResponse.data.data.reference
      }
    });
  } catch (error) {
    console.error(
      'Paystack Redirection Init Error:',
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: 'Payment gateway connection failed.',
      data: null
    });
  }
};

// Check subscription status (Before the Payment verification)
const getSubscriptionStatus = async (req, res) => {
  try {
    const { reference, providerName } = req.query; // Extracts ?reference=TX_... from URL parameters

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Required fields are missing or invalid.',
        data: null
      });
    }

    const subscription = await Subscription.findOne({
      userId: req.user._id,
      providerName: providerName || 'premium_tier'
    });

    const isComplete = subscription && subscription.status === 'active';

    // Returns the EXACT nested payload architecture required by frontend
    return res.status(200).json({
      success: true,
      message: 'Subscription status updated successfully.',
      data: {
        transaction_reference: reference,
        synchronization_complete: !!isComplete,
        user_account_state: {
          subscription_status: subscription ? subscription.status : 'pending',
          plan_tier: subscription ? 'premium' : 'none',
          access_entitlements_granted: !!isComplete
        }
      }
    });
  } catch (error) {
    console.error('Status Polling Loop Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving current subscription status.',
      data: null
    });
  }
};

module.exports = {
  initializeSubscription,
  getSubscriptionStatus
};
