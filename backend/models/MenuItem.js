const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: String,
  isAvailable: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: true },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
