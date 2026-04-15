import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import client from '../api/client.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const STATUS_FLOW = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

  const fetchOrder = async () => {
    try {
      const res = await client.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      setError('Order not found or an error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    const currentIndex = STATUS_FLOW.indexOf(order.status);
    if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) return;
    
    const nextStatus = STATUS_FLOW[currentIndex + 1];
    try {
      setUpdating(true);
      await client.patch(`/api/orders/${order.orderId}/status`, { status: nextStatus });
      toast.success(`Order marked as ${nextStatus}!`);
      await fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-medium print:hidden">Loading order details...</div>;
  if (error || !order) return <div className="p-8 text-red-500 font-medium bg-red-50 m-8 rounded-lg print:hidden">{error}</div>;

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="p-8 max-w-5xl mx-auto print:max-w-full print:p-0">
      <div className="mb-6 flex justify-between items-center print:hidden">
        <Link to="/orders" className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center gap-1.5">
          &larr; Back to Orders
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          🖨️ Print Receipt
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-2">Order <span className="text-blue-600">{order.orderId}</span></h1>
          <p className="text-gray-500 font-medium tracking-wide">Placed on {new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <StatusBadge status={order.status} />
          {order.estimatedDeliveryDate && (
            <div className="text-sm font-bold text-amber-800 bg-amber-50 px-4 py-2 rounded-lg flex items-center gap-2 border border-amber-200">
              📅 Est. Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold border-b border-gray-100 pb-4 mb-6 text-gray-800">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase font-bold text-gray-400 mb-1">Name</p>
                <p className="text-lg font-semibold text-gray-900">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-gray-400 mb-1">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Garments Table */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <h2 className="text-lg font-bold border-b border-gray-100 pb-4 mb-6 text-gray-800">Items & Billing</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
                    <th className="pb-3 text-left">Garment</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-800 text-base">
                  {order.garments.map((g, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors print:bg-white">
                      <td className="py-4 font-medium">{g.type}</td>
                      <td className="py-4 text-center font-bold">{g.quantity}</td>
                      <td className="py-4 text-right text-gray-500">₹{g.pricePerItem}</td>
                      <td className="py-4 text-right font-bold">₹{g.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan="3" className="pt-6 text-right font-bold text-gray-500 uppercase tracking-wide text-sm">Grand Total</td>
                    <td className="pt-6 text-right font-black text-blue-600 text-3xl print:text-black">₹{order.totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Tracking Stepper Sidebar */}
        <div className="lg:col-span-1 print:hidden">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 sticky top-8">
            <h2 className="text-lg font-bold border-b border-gray-100 pb-4 mb-8 text-gray-800">Order Status</h2>
            
            <div className="relative pl-4 space-y-10 before:absolute before:inset-y-2 before:left-[1.3rem] before:block before:w-0.5 before:bg-gray-100">
              {STATUS_FLOW.map((status, index) => {
                const historyRecord = order.statusHistory?.find(h => h.status === status);
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={status} className="relative flex items-start group">
                    <span className={`absolute -left-[1.60rem] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
                      isCompleted ? 'bg-blue-600 shadow-sm' : 'bg-gray-200'
                    }`}>
                      {isCompleted && <span className="h-2 w-2 bg-white rounded-full"></span>}
                    </span>
                    <div className="pl-6 w-full">
                      <p className={`text-sm font-bold flex justify-between items-center ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {status}
                        {isCurrent && <span className="text-[10px] uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">Current</span>}
                      </p>
                      {historyRecord && (
                        <p className="text-xs text-gray-500 mt-1.5 font-medium">{new Date(historyRecord.changedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      )}
                      {historyRecord?.note && (
                        <p className="text-sm bg-gray-50 border border-gray-100 rounded-md p-2 mt-2 text-gray-600 italic">"{historyRecord.note}"</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {currentStatusIndex < STATUS_FLOW.length - 1 && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-sm disabled:opacity-70 transition-all flex justify-center items-center focus:ring-4 focus:ring-blue-100"
                >
                  {updating ? 'Updating...' : `Update to ${STATUS_FLOW[currentStatusIndex + 1]}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
