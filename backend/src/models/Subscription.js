const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    providerName: {
      type: String,
      required: true,
      enum: [
        'premium_tier',
        'netflix',
        'spotify',
        'adobe_creative',
        'custom_tier'
      ], // Example catalogs
      default: 'premium_tier'
    },
    paystackCustomerCode: {
      type: String,
      default: null
    },
    paystackSubscriptionCode: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'past_due', 'cancelled'],
      default: 'pending',
      required: true
    },
    currentPeriodEnd: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Ensures a user can't link the exact same provider application twice
SubscriptionSchema.index({ userId: 1, providerName: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
