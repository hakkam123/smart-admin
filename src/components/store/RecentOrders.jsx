'use client'
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiClock } from 'react-icons/fi';
import Link from 'next/link';

export default function RecentOrders() {
  const { getToken } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rp. ';

  const getStatusColor = (status) => {
    switch (status) {
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'ORDER_PLACED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ORDER_PLACED': return 'Order Placed';
      case 'PROCESSING': return 'Processing';
      case 'SHIPPED': return 'Shipped';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = await getToken();

      const { data } = await axios.get(`${baseUrl}/api/store/recent-orders?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRecentOrders(data.recentOrders || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecentOrders();

    // Auto refresh setiap 30 detik untuk "live" effect
    const interval = setInterval(() => {
      fetchRecentOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <div className="ml-3 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="ml-2 text-sm text-gray-600">Live</span>
            </div>
          </div>
          <Link href="/admin/orders" className="text-orange-600 hover:text-orange-700 text-sm">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse p-4 border border-gray-100 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentOrders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <div className="ml-3 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="ml-2 text-sm text-gray-600">Live</span>
            </div>
          </div>
          <Link href="/admin/orders" className="text-orange-600 hover:text-orange-700 text-sm">
            View All
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          Belum ada order
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <div className="ml-3 flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="ml-2 text-sm text-gray-600">Live</span>
          </div>
        </div>
        <Link
          href="/admin/orders"
          className="text-orange-600 hover:text-orange-700 text-sm flex items-center"
        >
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {recentOrders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="block p-4 border border-gray-100 rounded-lg hover:border-orange-200 hover:bg-orange-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">
                    #{order.id.substring(0, 8).toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium text-gray-900 text-sm">
                    {currency}{order.total.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <FiClock className="mr-1" size={12} />
                    {order.timeAgo}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
