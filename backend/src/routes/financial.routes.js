const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const Coupon = require('../models/Coupon');
const Invoice = require('../models/Invoice');

// Mock authentication middleware for testing purposes
const mockAuth = (req, res, next) => {
  req.user = {
    _id: '64f1a2b3c4d5e6f7a8b9c0de',
    email: 'test-student@tsacademy.edu'
  };
  next();
};

router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    return res
      .status(200)
      .json({ success: true, count: plans.length, data: plans });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Failed to retrieve plans.' });
  }
});

router.post('/plans', async (req, res) => {
  try {
    const { name, slug, paystackPlanCode, amount, interval, description } =
      req.body;

    if (!name || !slug || !paystackPlanCode || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required plan configuration fields.'
      });
    }

    const newPlan = await Plan.create({
      name,
      slug: slug.toLowerCase().trim(),
      paystackPlanCode: paystackPlanCode.trim(),
      amount,
      interval,
      description
    });

    return res.status(201).json({
      success: true,
      message: 'Plan created successfully.',
      data: newPlan
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A plan with this slug already exists.'
      });
    }
    return res
      .status(500)
      .json({ success: false, message: 'Failed to create plan.' });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, maxUses } = req.body;

    if (!code || !discountType || !discountValue || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required coupon payload fields.'
      });
    }

    const newCoupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue,
      expiryDate: new Date(expiryDate),
      maxUses
    });

    return res.status(201).json({
      success: true,
      message: 'Promotional coupon created successfully.',
      data: newCoupon
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This coupon code is already registered.'
      });
    }
    return res
      .status(500)
      .json({ success: false, message: 'Failed to register coupon.' });
  }
});

router.get('/invoices', mockAuth, async (req, res) => {
  try {
    // Uses the authenticated identity injected by your JWT token verification middleware
    const userReceipts = await Invoice.find({ userId: req.user._id }).sort({
      createdAt: -1
    });
    return res
      .status(200)
      .json({ success: true, count: userReceipts.length, data: userReceipts });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Failed to retrieve ledger receipts.' });
  }
});

module.exports = router;
