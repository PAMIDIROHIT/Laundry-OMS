/**
 * @fileoverview Validation middleware using express-validator.
 */

import { body, validationResult } from 'express-validator';

/**
 * Middleware that evaluates the result of express-validator rules.
 * Responds with 400 and the array of errors if validation fails.
 */
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateCreateOrder = [
  body('customerName')
    .isString()
    .notEmpty()
    .trim()
    .withMessage('Customer name must be a non-empty string'),
  body('customerPhone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Customer phone must be a 10-digit number'),
  body('garments')
    .isArray({ min: 1 })
    .withMessage('Garments must be a non-empty array'),
  body('garments.*.type')
    .isIn(['Shirt', 'Pants', 'Saree', 'Jacket', 'Suit', 'Kurta', 'Blazer'])
    .withMessage('Invalid garment type selected'),
  body('garments.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer >= 1')
];

export const validateUpdateStatus = [
  body('status')
    .isIn(['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'])
    .withMessage('Status must be one of RECEIVED, PROCESSING, READY, or DELIVERED')
];
