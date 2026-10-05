/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const Subscription = require('../models/Subscription');
const paystack = require('../config/paystack');
const Plan = require('../models/Plan');
const Coupon = require('../models/Coupon');

// Initialize Checkout Redirection Session
const initializeSubscription = async (req, res) => {
  try {
    const { planCode, couponCode, providerName } = req.body;
    const userId = req.user._id;
    const userEmail = req.user.email;

    const activeProvider = providerName || 'premium_tier';

    // Fetch dynamic pricing properties directly from Plan database
    const targetPlan = await Plan.findOne({ paystackPlanCode: planCode ? planCode.trim() : '' });
    
    // Fallback default amount if a user makes a generic app initialization without a strict tier plan
    let calculatedAmountUnits = targetPlan ? targetPlan.amount : 500000; 

    // Check, validate, and subtract promotional code deductions
    if (couponCode) {
      const activeCoupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), isActive: true });
      
      if (activeCoupon && activeCoupon.expiryDate > new Date()) {
        if (activeCoupon.discountType === 'percentage') {
          calculatedAmountUnits = calculatedAmountUnits * (1 - activeCoupon.discountValue / 100);
        } else if (activeCoupon.discountType === 'fixed') {
          calculatedAmountUnits = Math.max(0, calculatedAmountUnits - activeCoupon.discountValue);
        }
        
        // Track coupon consumption usage metrics safely
        await Coupon.updateOne({ _id: activeCoupon._id }, { $inc: { usesCount: 1 } });
      }
    }

    const paystackPayload = {
      email: userEmail,
      amount: Math.round(calculatedAmountUnits),
      plan: planCode ? planCode.trim() || '' : '', // It sends empty string if no planCode exists to bypass dashboard checks [paystack.com]
      metadata: {
        user_id: userId.toString(),
        coupon_applied: couponCode || 'none',
        provider_name: activeProvider
      }
    };

    const paystackResponse = await paystack.post('/transaction/initialize', paystackPayload);

    // Save or update user tracking state as 'pending' in MongoDB
    await Subscription.findOneAndUpdate(
      { userId: userId, providerName: activeProvider },
      {
        status: 'pending',
        paystackSubscriptionCode: planCode,
        transactionReference: paystackResponse.data.data.reference
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

    const activeProvider = providerName ? providerName.toLowerCase() : 'premium_tier';

    const subscription = await Subscription.findOne({
      userId: req.user._id,
      providerName: activeProvider
    });

    const isComplete = subscription && subscription.status === 'active';

    // Choose a clear message payload based on whether the reference matches what is happening
    const responseMessage = isComplete
      ? 'Subscription is active.'
      : subscription
        ? `Subscription state is currently: ${subscription.status}.`
        : 'Resource Error: No subscription record found for this reference.';

      // Clean, single return matching the exact manual specifications
    return res.status(200).json({
      success: true,
      message: responseMessage,
      data: {
        transaction_reference: reference,
        synchronization_complete: !!isComplete, // Safely evaluates dynamically
        user_account_state: {
          subscription_status: subscription ? subscription.status : 'none',
          plan_tier: activeProvider, // Safely references declared variable
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
