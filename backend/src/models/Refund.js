const mongoose = require('mongoose');

const RefundSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true
    },
    paystackRefundId: { type: String },
    amount: { type: Number, required: true }, // Amount returned in kobo
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Refund', RefundSchema);
