const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'preparing', 'served', 'cancelled'],
    default: 'pending',
  },
  paymentId: String,
  razorpayOrderId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
