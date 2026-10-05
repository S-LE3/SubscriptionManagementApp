/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const crypto = require('crypto');
const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');
const Token = require('../models/Token');

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
      const subscriptionCode = typeof transactionData.plan === 'string' ? transactionData.plan : '';

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
 //Automatically spawn a verified invoice transaction record
      await Invoice.create({
        userId: userId,
        providerName: providerName,
        amount: transactionData.amount,
        status: 'paid',
        reference: transactionData.reference,
        paidAt: new Date(transactionData.paid_at)
      });

      // Save recurring card authorization token if provided by Paystack
      if (transactionData.authorization?.authorization_code) {
        const auth = transactionData.authorization;
        await Token.findOneAndUpdate(
          { userId: userId, authCode: auth.authorization_code },
          {
            cardType: auth.card_type,
            lastFour: auth.last4,
            expMonth: auth.exp_month,
            expYear: auth.exp_year,
            customerEmail: transactionData.customer.email
          },
          { upsert: true }
        );
      }

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
