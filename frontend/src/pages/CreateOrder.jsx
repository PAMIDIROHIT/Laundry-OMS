import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../api/client.js';
import { GARMENT_PRICES } from '../constants/prices.js';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [garments, setGarments] = useState([{ type: 'Shirt', quantity: 1 }]);
  const [submitting, setSubmitting] = useState(false);

  const GARMENT_TYPES = Object.keys(GARMENT_PRICES);

  const billSummary = useMemo(() => {
    let totalAmount = 0;
    const items = garments.map(g => {
      const price = GARMENT_PRICES[g.type] || 0;
      const sub = price * (Number(g.quantity) || 0);
      totalAmount += sub;
      return { ...g, price, sub };
    });
    return { items, totalAmount };
  }, [garments]);

  const handleAddGarment = () => {
    setGarments([...garments, { type: 'Shirt', quantity: 1 }]);
  };

  const handleRemoveGarment = (index) => {
    if (garments.length > 1) {
      setGarments(garments.filter((_, i) => i !== index));
    }
  };

  const handleChangeGarment = (index, field, value) => {
    const updated = [...garments];
    updated[index][field] = value;
    setGarments(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!/^[0-9]{10}$/.test(customerPhone)) {
      toast.error('Customer phone must be exactly 10 digits.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await client.post('/api/orders', {
        customerName,
        customerPhone,
        garments: garments.map(g => ({ type: g.type, quantity: Number(g.quantity) }))
      });
      toast.success('Order created successfully!');
      navigate(`/orders/${res.data.orderId}`);
    } catch (err) {
      const errMsg = err.response?.data?.errors 
        ? err.response.data.errors.map(e => e.msg).join(', ')
        : err.response?.data?.message || 'Failed to create order';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-gray-800 print:p-0">
      <Link to="/orders" className="text-blue-500 font-medium hover:underline inline-flex items-center gap-1 mb-6 print:hidden">
        &larr; Back to Orders
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Order</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Form Panel */}
        <div className="flex-1 w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Name</label>
                <input 
                  type="text" required placeholder="John Doe"
                  value={customerName} onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Phone</label>
                <input 
                  type="text" required pattern="[0-9]{10}" placeholder="9876543210"
                  title="10 digit phone number"
                  value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mb-6 flex justify-between items-end border-b border-gray-200 pb-3">
              <h3 className="text-xl font-bold text-gray-800">Garments</h3>
              <button 
                type="button" 
                onClick={handleAddGarment}
                className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                + Add Garment
              </button>
            </div>

            <div className="space-y-4 mb-10">
              {garments.map((g, idx) => (
                <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200 transition-all hover:border-blue-200">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1.5">Type</label>
                    <select 
                      value={g.type} 
                      onChange={e => handleChangeGarment(idx, 'type', e.target.value)}
                      className="w-full border border-gray-200 bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {GARMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1.5">Qty</label>
                    <input 
                      type="number" min="1" required
                      value={g.quantity} 
                      onChange={e => handleChangeGarment(idx, 'quantity', e.target.value)}
                      className="w-full border border-gray-200 bg-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="w-24 hidden sm:block">
                    <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1.5">Price</label>
                    <div className="p-2.5 text-gray-500 bg-transparent">₹{billSummary.items[idx].price}</div>
                  </div>
                  <div className="w-24 hidden sm:block">
                    <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1.5">Subtotal</label>
                    <div className="p-2.5 font-bold text-gray-900 bg-transparent">₹{billSummary.items[idx].sub}</div>
                  </div>
                  <div className="w-12 flex justify-end items-end h-full pt-[22px]">
                    <button 
                      type="button" onClick={() => handleRemoveGarment(idx)}
                      disabled={garments.length === 1}
                      className="text-red-500 bg-red-50 hover:bg-red-100 p-2.5 rounded-lg disabled:opacity-40 disabled:hover:bg-red-50 transition-colors w-full flex justify-center items-center font-bold text-xl"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button 
                type="submit" disabled={submitting}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl shadow-sm font-bold text-lg hover:bg-blue-700 disabled:opacity-70 transition-all flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Bill Summary Sticky Panel */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8">
          <h2 className="text-xl font-bold border-b border-gray-100 pb-4 mb-6">Bill Summary</h2>
          <div className="space-y-4 mb-8">
            {billSummary.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">
                  <span className="text-gray-400 mr-2">{item.quantity}x</span>
                  {item.type}
                </span>
                <span className="font-bold text-gray-800">₹{item.sub}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-5 flex justify-between items-end">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Grand Total</span>
            <span className="text-3xl font-black text-blue-600 leading-none">₹{billSummary.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
