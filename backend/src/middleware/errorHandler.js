/**
 * @fileoverview Global error handling middleware.
 */

import { logger } from '../utils/logger.js';

/**
 * Catches all errors passed to next() and appropriately shapes the HTTP response.
 */
export const errorHandler = (err, req, res, next) => {
  logger('Error caught by global handler:', err.message);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error', 
      details: err.message 
    });
  }

  // MongoDB Duplicate Key Error (e.g. orderId collision)
  if (err.code === 11000) {
    return res.status(409).json({ 
      message: 'Duplicate order ID, please retry' 
    });
  }

  // Default to 500 Internal Server Error
  const response = { message: 'Internal server error' };

  // Include error message in development mode, but never expose stack trace
  if (process.env.NODE_ENV !== 'production') {
    response.message = err.message || response.message;
  }

  res.status(500).json(response);
};
