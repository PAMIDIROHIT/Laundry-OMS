/**
 * @fileoverview Main application component.
 * Sets up routing for the Laundry Order Management System.
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Orders from './pages/Orders.jsx';
import CreateOrder from './pages/CreateOrder.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import NotFound from './pages/NotFound.jsx';

/**
 * App component that holds the application routes and layout.
 * @returns {JSX.Element} The rendered React app layout and routes.
 */
function App() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      <Toaster position="top-right" reverseOrder={false} />
      <Sidebar />
      <main className="flex-1 ml-64 print:ml-0 min-w-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<CreateOrder />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
