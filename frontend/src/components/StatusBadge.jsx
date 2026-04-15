import React from 'react';

const statusColors = {
  RECEIVED: 'bg-gray-100 text-gray-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  READY: 'bg-amber-100 text-amber-800',
  DELIVERED: 'bg-green-100 text-green-800'
};

export default function StatusBadge({ status }) {
  const colorClass = statusColors[status] || statusColors.RECEIVED;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {status}
    </span>
  );
}
