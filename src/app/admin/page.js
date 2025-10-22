'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiMoreVertical,
  FiFilter,
  FiCalendar,
  FiClock,
  FiMessageCircle,
  FiExternalLink,
  FiStar,
  FiBell
} from 'react-icons/fi';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7 days');
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

  const stats = [
    {
      title: 'Total Revenue',
      value: 'Rp 45,231,890',
      change: '+20.1%',
      isPositive: true,
      icon: FiDollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: '2,350',
      change: '+12.5%',
      isPositive: true,
      icon: FiShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Products',
      value: '1,234',
      change: '+5.3%',
      isPositive: true,
      icon: FiTrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Customers',
      value: '890',
      change: '+8.7%',
      isPositive: true,
      icon: FiUsers,
      color: 'bg-orange-500'
    }
  ];

  const bestProducts = [
    { name: 'Wireless Headphones', sales: 1245, revenue: 'Rp 62,250,000', rating: 4.8, change: '+15.2%' },
    { name: 'Smart Watch', sales: 987, revenue: 'Rp 98,700,000', rating: 4.7, change: '+22.8%' },
    { name: 'Laptop Stand', sales: 756, revenue: 'Rp 37,800,000', rating: 4.9, change: '+8.5%' },
    { name: 'USB-C Hub', sales: 654, revenue: 'Rp 32,700,000', rating: 4.6, change: '+12.3%' },
    { name: 'Phone Case', sales: 543, revenue: 'Rp 16,290,000', rating: 4.5, change: '+5.7%' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock chart data points for simple SVG chart
  const chartData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 75 },
    { day: 'Wed', value: 55 },
    { day: 'Thu', value: 85 },
    { day: 'Fri', value: 70 },
    { day: 'Sat', value: 90 },
    { day: 'Sun', value: 80 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          {/* <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your store today.</p> */}
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-600 text-gray-600 rounded-lg text-sm">
            <FiCalendar className="mr-2" />
            {selectedPeriod}
          </button>
          <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <FiFilter className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.isPositive ? (
                    <FiArrowUp className="text-green-500 mr-1" size={16} />
                  ) : (
                    <FiArrowDown className="text-red-500 mr-1" size={16} />
                  )}
                  <span className={`text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
              <p className="text-gray-600">Revenue trends over the past week</p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-600 text-gray-600 rounded-lg text-sm"
              >
                <option value="7 days">Last 7 days</option>
                <option value="30 days">Last 30 days</option>
                <option value="90 days">Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Simple SVG Chart */}
          <div className="h-64">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Chart Grid */}
              <defs>
                <pattern id="grid" width="57" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 57 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Chart Line */}
              <polyline
                fill="none"
                stroke="#ea580c"
                strokeWidth="3"
                points={chartData.map((point, index) => `${index * 57 + 28.5},${200 - (point.value * 1.5)}`).join(' ')}
              />
              
              {/* Chart Points */}
              {chartData.map((point, index) => (
                <circle
                  key={index}
                  cx={index * 57 + 28.5}
                  cy={200 - (point.value * 1.5)}
                  r="4"
                  fill="#ea580c"
                  className="hover:r-6 transition-all"
                />
              ))}
              
              {/* X-axis labels */}
              {chartData.map((point, index) => (
                <text
                  key={index}
                  x={index * 57 + 28.5}
                  y="190"
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {point.day}
                </text>
              ))}
            </svg>
          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Revenue: Rp 45,231,890</span>
            <span className="text-green-600">↗ +20.1% from last week</span>
          </div>
        </div>

        {/* Best Product Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Best Product Sales</h3>
            <Link href="/admin/products" className="text-orange-600 hover:text-orange-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {bestProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                  <div className="flex items-center mt-1">
                    <FiStar className="text-yellow-400 mr-1" size={14} />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                    <span className="text-xs text-gray-400 mx-2">•</span>
                    <span className="text-xs text-gray-600">{product.sales} sold</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">{product.revenue}</p>
                </div>
                <div className="text-right">
                  <span className="text-green-600 text-sm font-medium">{product.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Orders and Customer Relationship */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              View All <FiExternalLink className="ml-1" size={14} />
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

        {/* Customer Relationship */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Relationship</h3>
            <Link 
              href="/admin/messages" 
              className="text-orange-600 hover:text-orange-700 text-sm flex items-center"
            >
              View All <FiExternalLink className="ml-1" size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentChats.map((chat, index) => (
              <Link 
                key={index} 
                href={`/admin/messages?chat=${chat.id}`}
                className="block p-4 border border-gray-100 rounded-lg hover:border-orange-200 hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{chat.customer}</span>
                      {chat.unread > 0 && (
                        <div className="flex items-center">
                          <FiBell className="text-orange-600 mr-1" size={14} />
                          <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                            {chat.unread}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{chat.message}</p>
                    <div className="flex items-center mt-2">
                      <FiMessageCircle className="text-gray-400 mr-1" size={12} />
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}