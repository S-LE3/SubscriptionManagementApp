const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true }, // e.g. "netflix-premium"
    paystackPlanCode: { type: String, required: true, trim: true }, // e.g. "PLN_xxx"
    amount: { type: Number, required: true }, // Stored in kobo/cents (e.g., 500000 for 5000 NGN)
    interval: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'annually'],
      default: 'monthly'
    },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', PlanSchema);
