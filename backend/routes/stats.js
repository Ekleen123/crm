// routes/stats.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customers'); // adjust if filename is different

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    // Count total orders
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue
    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Find top customer by spend
    const topCustomer = await Customer.findOne().sort({ spend: -1 });

    // Find top 5 customers by spend
    const topCustomers = await Customer.find()
      .sort({ spend: -1 })
      .limit(5)
      .select("name spend email");

    res.json({
      totalOrders,
      totalRevenue,
      avgOrderValue,
      topCustomer: topCustomer
        ? { name: topCustomer.name, spend: topCustomer.spend }
        : null,
      topCustomers // array of { name, spend, email }
    });
  } catch (err) {
    console.error('GET /api/stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
