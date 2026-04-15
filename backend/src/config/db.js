/**
 * @fileoverview Database connection setup using Mongoose.
 * Connects to MongoDB and logs the status using the logger utility.
 */
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Connects to the MongoDB database using the environment URI.
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry';
    const conn = await mongoose.connect(uri);
    logger(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
