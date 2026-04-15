/**
 * @fileoverview Express routes mapping order endpoints to controllers.
 */

import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController.js';
import { 
  validateCreateOrder, 
  validateUpdateStatus, 
  handleValidation 
} from '../middleware/validate.js';

const router = Router();

router.post('/', validateCreateOrder, handleValidation, createOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.patch('/:orderId/status', validateUpdateStatus, handleValidation, updateOrderStatus);

export default router;
