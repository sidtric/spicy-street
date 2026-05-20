const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Place order after payment
router.post('/', async (req, res) => {
  const { tableNumber, items, totalAmount, paymentId, razorpayOrderId } = req.body;
  try {
    const order = await Order.create({ tableNumber, items, totalAmount, paymentId, razorpayOrderId, status: 'paid' });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET all orders (admin) with optional status filter
router.get('/', async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET orders for a table
router.get('/table/:tableNumber', async (req, res) => {
  try {
    const orders = await Order.find({ tableNumber: req.params.tableNumber }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET stats for payment tracking
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [total, todayOrders, revenue, todayRevenue] = await Promise.all([
      Order.countDocuments({ status: { $ne: 'cancelled' } }),
      Order.countDocuments({ createdAt: { $gte: today }, status: { $ne: 'cancelled' } }),
      Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, sum: { $sum: '$totalAmount' } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } }, { $group: { _id: null, sum: { $sum: '$totalAmount' } } }]),
    ]);
    res.json({
      totalOrders: total,
      todayOrders,
      totalRevenue: revenue[0]?.sum || 0,
      todayRevenue: todayRevenue[0]?.sum || 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// PATCH update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
