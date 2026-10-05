const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    }, // e.g. "TSA50"
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: { type: Number, required: true }, // e.g. 50 for 50% or 200000 for 2000 NGN
    expiryDate: { type: Date, required: true },
    maxUses: { type: Number, default: 100 },
    usesCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', CouponSchema);
