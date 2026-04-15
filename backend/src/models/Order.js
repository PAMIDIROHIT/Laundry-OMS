/**
 * @fileoverview Mongoose schema and model for a Laundry Order.
 */
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const garmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Shirt', 'Pants', 'Saree', 'Jacket', 'Suit', 'Kurta', 'Blazer'],
    required: true
  },
  quantity: { type: Number, required: true, min: 1 },
  pricePerItem: Number,
  subtotal: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }
  },
  garments: [garmentSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
    default: 'RECEIVED'
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    note: String
  }],
  estimatedDeliveryDate: Date
}, { timestamps: true });

// Pre-save hook to auto-generate orderId and estimatedDeliveryDate
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${nanoid(6).toUpperCase()}`;
  }
  
  if (this.isNew && !this.estimatedDeliveryDate) {
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    this.estimatedDeliveryDate = estDate;
  }
  
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
