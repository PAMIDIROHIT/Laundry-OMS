/**
 * @fileoverview Main entry point for the backend server of the Laundry Order Management System.
 * Sets up Express app, middleware, routes, global error handler, and database connection.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { logger } from './src/utils/logger.js';
import orderRoutes from './src/routes/orderRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mount Points
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry';

// Connect to MongoDB & Start Server
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger('Successfully connected to MongoDB');
    app.listen(PORT, () => {
      logger(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger('Failed to connect to MongoDB', err);
  });
