const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authCode: { type: String, required: true }, // Paystack's authorization_code (e.g. AUTH_xxx)
    cardType: { type: String }, // e.g., "visa", "mastercard"
    lastFour: { type: String }, // e.g., "1234"
    expMonth: { type: String },
    expYear: { type: String },
    customerEmail: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Token', TokenSchema);
