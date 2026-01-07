'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CardSeller from '@/components/store/CardSeller';
import RevenueChart from '@/components/store/RevenueChart';
import BestProducts from '@/components/store/BestProducts';
import {
  FiFilter,
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiStar
} from 'react-icons/fi';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7 hari');
  const [liveOrders, setLiveOrders] = useState([]);
  const [recentChats, setRecentChats] = useState([]);

  // Mock data for live orders
  useEffect(() => {
    const mockLiveOrders = [
      { id: '#10001', customer: 'John Doe', status: 'Processing', amount: 'Rp 1,255,000', time: '2 mins ago' },
      { id: '#10002', customer: 'Sarah Smith', status: 'Confirmed', amount: 'Rp 899,900', time: '5 mins ago' },
      { id: '#10003', customer: 'Mike Johnson', status: 'Shipped', amount: 'Rp 2,347,500', time: '8 mins ago' },
      { id: '#10004', customer: 'Emma Wilson', status: 'Delivered', amount: 'Rp 1,562,000', time: '12 mins ago' },
      { id: '#10005', customer: 'David Brown', status: 'Processing', amount: 'Rp 678,000', time: '15 mins ago' }
    ];
    setLiveOrders(mockLiveOrders);

    // Mock data for recent chats
    const mockChats = [
      { id: 1, customer: 'Alice Cooper', message: 'When will my order arrive?', time: '3 mins ago', unread: 2 },
      { id: 2, customer: 'Bob Martin', message: 'I need to change my address', time: '7 mins ago', unread: 1 },
      { id: 3, customer: 'Carol Davis', message: 'Product inquiry about...', time: '12 mins ago', unread: 0 },
      { id: 4, customer: 'Dan Wilson', message: 'Thank you for the help!', time: '18 mins ago', unread: 0 },
      { id: 5, customer: 'Eve Taylor', message: 'Refund request for order', time: '25 mins ago', unread: 3 }
    ];
    setRecentChats(mockChats);
  }, []);


  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          {/* <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your store today.</p> */}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center px-3 py-2 border border-gray-600 text-gray-600 rounded-lg text-sm">
            <FiCalendar className="mr-2" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="7 hari">7 hari</option>
              <option value="1 bulan">1 bulan</option>
              <option value="3 bulan">3 bulan</option>
              <option value="6 bulan">6 bulan</option>
              <option value="1 tahun">1 tahun</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <CardSeller period={selectedPeriod} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
              <p className="text-gray-600">Revenue trends for {selectedPeriod}</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-600 text-gray-600 rounded-lg text-sm"
              >
                <option value="7 hari">7 hari</option>
                <option value="1 bulan">1 bulan</option>
                <option value="3 bulan">3 bulan</option>
                <option value="6 bulan">6 bulan</option>
                <option value="1 tahun">1 tahun</option>
              </select>
            </div>
          </div>

          {/* Revenue Chart Component */}
          <RevenueChart period={selectedPeriod} />
        </div>

        {/* Best Product Sales */}
        <BestProducts />
      </div>

      {/* Live Orders */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">Live Orders</h3>
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
          {liveOrders.map((order, index) => (
            <Link
              key={index}
              href={`/admin/orders/${order.id.replace('#', '')}`}
              className="block p-4 border border-gray-100 rounded-lg hover:border-orange-200 hover:bg-orange-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{order.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium text-gray-900">{order.amount}</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <FiClock className="mr-1" size={12} />
                      {order.time}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}