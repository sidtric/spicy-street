const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET all menu items grouped by category (customer view)
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true });
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// GET all items flat (admin view)
router.get('/all', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// POST add new item
router.post('/', async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PATCH update item
router.patch('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
