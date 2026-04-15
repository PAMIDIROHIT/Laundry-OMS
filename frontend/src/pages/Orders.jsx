import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { GARMENT_PRICES } from '../constants/prices.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [garmentFilter, setGarmentFilter] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch orders when filters change
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        if (garmentFilter) params.garmentType = garmentFilter;
        
        if (debouncedSearch) {
          if (/^\d+$/.test(debouncedSearch)) {
            params.phone = debouncedSearch;
          } else {
            params.name = debouncedSearch;
          }
        }
        
        const res = await client.get('/api/orders', { params });
        setOrders(res.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [debouncedSearch, statusFilter, garmentFilter]);

  const STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
  const GARMENT_TYPES = Object.keys(GARMENT_PRICES);

  return (
    <div className="p-8 text-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <Link 
          to="/orders/new" 
          className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          + Create New Order
        </Link>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or 10-digit phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors min-w-[150px]"
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={garmentFilter}
          onChange={(e) => setGarmentFilter(e.target.value)}
          className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors min-w-[150px]"
        >
          <option value="">All Garment Types</option>
          {GARMENT_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500 font-medium p-8 text-center bg-white rounded-xl border border-gray-100">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500 font-medium p-12 text-center bg-white rounded-xl border border-gray-100 flex flex-col items-center">
          <span className="text-4xl mb-4 opacity-50">📋</span>
          No orders found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map(order => {
            const totalItems = order.garments.reduce((acc, g) => acc + g.quantity, 0);
            return (
              <div key={order.orderId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-5 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.orderId}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                
                <div className="mb-5 flex-1">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    👤 {order.customer.name}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    📞 {order.customer.phone}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-5 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Garments: {totalItems} items</span>
                    <span className="text-lg font-bold text-gray-900">₹{order.totalAmount}</span>
                  </div>
                  {order.estimatedDeliveryDate && (
                    <p className="text-xs font-semibold text-blue-700 mt-2 pt-2 border-t border-gray-200 flex items-center gap-1.5">
                      📅 Est. Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <Link 
                  to={`/orders/${order.orderId}`}
                  className="block w-full text-center border border-gray-200 bg-white shadow-sm rounded-lg py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
