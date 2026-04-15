/**
 * @fileoverview Order controllers handling business logic for order management.
 */

import Order from '../models/Order.js';
import { calculateBill } from '../utils/billing.js';

/**
 * Creates a new laundry order.
 */
export const createOrder = async (req, res, next) => {
  try {
    const { customerName, customerPhone, garments } = req.body;

    const [enrichedGarments, totalAmount] = calculateBill(garments);

    const order = new Order({
      customer: {
        name: customerName,
        phone: customerPhone
      },
      garments: enrichedGarments,
      totalAmount,
      statusHistory: [{
        status: 'RECEIVED',
        changedAt: new Date()
      }]
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves orders based on flexible query parameters.
 */
export const getOrders = async (req, res, next) => {
  try {
    const { status, name, phone, garmentType } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    if (name) {
      query['customer.name'] = { $regex: name, $options: 'i' };
    }
    if (phone) {
      query['customer.phone'] = phone;
    }
    if (garmentType) {
      query['garments.type'] = garmentType;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single order by its unique orderId (ORD-XXXXXX).
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the status of an existing order enforcing valid state transitions.
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status: newStatus, note } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const validTransitions = {
      'RECEIVED': 'PROCESSING',
      'PROCESSING': 'READY',
      'READY': 'DELIVERED'
    };

    if (validTransitions[order.status] !== newStatus) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      changedAt: new Date(),
      note
    });

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
