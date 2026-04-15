/**
 * @fileoverview Dashboard controllers providing aggregated analytics data.
 */

import Order from '../models/Order.js';

/**
 * Retrieves dashboard statistics leveraging parallel MongoDB aggregations.
 */
export const getDashboard = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      revenueResult,
      statusAggregation,
      ordersToday,
      garmentRevenueResult
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.aggregate([
        { $unwind: '$garments' },
        { $group: { _id: '$garments.type', total: { $sum: '$garments.subtotal' } } }
      ])
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const ordersByStatus = {};
    statusAggregation.forEach(item => {
      ordersByStatus[item._id] = item.count;
    });

    const revenueByGarmentType = {};
    garmentRevenueResult.forEach(item => {
      revenueByGarmentType[item._id] = item.total;
    });

    res.status(200).json({
      totalOrders,
      totalRevenue,
      ordersByStatus,
      ordersToday,
      revenueByGarmentType
    });
  } catch (error) {
    next(error);
  }
};
