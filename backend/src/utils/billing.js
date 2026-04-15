/**
 * @fileoverview Billing logic and pricing constants for the laundry OMS.
 * Contains purely functional utilities for calculating order bills.
 */

export const GARMENT_PRICES = {
  Shirt: 50,
  Pants: 60,
  Saree: 150,
  Jacket: 120,
  Suit: 250,
  Kurta: 80,
  Blazer: 130
};

/**
 * Calculates the bill for a list of garments.
 * Pure function with no side effects.
 * 
 * @param {Array<{type: string, quantity: number}>} garments - List of selected garments
 * @returns {[Array<{type: string, quantity: number, pricePerItem: number, subtotal: number}>, number]} 
 *          A tuple containing the updated garments array and the total amount
 */
export const calculateBill = (garments) => {
  let totalAmount = 0;
  
  const updatedGarments = garments.map(garment => {
    const pricePerItem = GARMENT_PRICES[garment.type] || 0;
    const subtotal = pricePerItem * garment.quantity;
    
    totalAmount += subtotal;
    
    return {
      ...garment,
      pricePerItem,
      subtotal
    };
  });

  return [updatedGarments, totalAmount];
};
