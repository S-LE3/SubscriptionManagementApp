/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const crypto = require('crypto');
const Subscription = require('../models/Subscription');

const handlePaystackWebhook = async (req, res) => {
  try {
    const paystackSignature = req.headers['x-paystack-signature'];

    if (!paystackSignature) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Missing gateway signature.'
      });
    }

    const calculatedHash = crypto
      .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET)
      .update(req.rawBody)
      .digest('hex');

    if (calculatedHash !== paystackSignature) {
      console.warn('Warning: Invalid payload signature signature intercepted!');
      return res.status(401).json({
        success: false,
        message: 'Webhook verification failed.'
      });
    }

    res
      .status(200)
      .json({ success: true, message: 'Notification received successfully.' });

    const eventPayload = req.body;
    console.log(`Processing incoming gateway event: ${eventPayload.event}`);

    if (eventPayload.event === 'charge.success') {
      const transactionData = eventPayload.data;
      const { metadata } = transactionData;

      const userId = metadata?.user_id;
      const providerName = metadata?.provider_name || 'premium_tier';
      const customerCode = transactionData.customer?.customer_code || null;
      const subscriptionCode = transactionData.plan || null;

      if (!userId) {
        return console.error('Missing user metadata.');
      }

      // Calculate automated expiration periods
      const executionPeriodEnd = new Date();
      executionPeriodEnd.setDate(executionPeriodEnd.getDate() + 30);

      await Subscription.findOneAndUpdate(
        { userId: userId, providerName: providerName },
        {
          status: 'active', // TURNS THE STATUS GREEN!
          paystackCustomerCode: customerCode,
          paystackSubscriptionCode: subscriptionCode,
          currentPeriodEnd: executionPeriodEnd
        },
        { upsert: true, returnDocument: 'after' }
      );

      console.log(
        `Success: ${providerName} subscription activated for User ID: ${userId}`
      );
    }

    if (eventPayload.event === 'subscription.disable') {
      const disableData = eventPayload.data;
      const subscriptionCode = disableData.subscription_code;

      await Subscription.findOneAndUpdate(
        { paystackSubscriptionCode: subscriptionCode },
        { status: 'cancelled' }
      );

      console.log(
        `Notice: Subscription ${subscriptionCode} turned off due to external gateway trigger.`
      );
    }
  } catch (error) {
    console.error('Webhook failure:', error.message);
  }
};

module.exports = { handlePaystackWebhook };
