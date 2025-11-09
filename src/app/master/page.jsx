'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiUsers, 
  FiShoppingCart, 
  FiFilter,
  FiCalendar,
  FiExternalLink,
  FiShoppingBag,
  FiStar,
  FiPackage,
} from 'react-icons/fi';
import CardAdmin from '@/components/master/CardAdmin';

export default function MasterDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7 days');
  const [liveOrders, setLiveOrders] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [recentServices, setRecentServices] = useState([]);

  // Mock data
  useEffect(() => {
    const mockLiveOrders = [
      { id: '#10001', customer: 'John Doe', status: 'Processing', amount: 'Rp 1,255,000', time: '2 mins ago' },
      { id: '#10002', customer: 'Sarah Smith', status: 'Confirmed', amount: 'Rp 899,900', time: '5 mins ago' },
      { id: '#10003', customer: 'Mike Johnson', status: 'Shipped', amount: 'Rp 2,347,500', time: '8 mins ago' },
      { id: '#10004', customer: 'Emma Wilson', status: 'Delivered', amount: 'Rp 1,562,000', time: '12 mins ago' },
      { id: '#10005', customer: 'David Brown', status: 'Processing', amount: 'Rp 678,000', time: '15 mins ago' }
    ];
    setLiveOrders(mockLiveOrders);

    const mockChats = [
      { id: 1, customer: 'Alice Cooper', message: 'When will my order arrive?', time: '3 mins ago', unread: 2 },
      { id: 2, customer: 'Bob Martin', message: 'I need to change my address', time: '7 mins ago', unread: 1 },
      { id: 3, customer: 'Carol Davis', message: 'Product inquiry about...', time: '12 mins ago', unread: 0 },
      { id: 4, customer: 'Dan Wilson', message: 'Thank you for the help!', time: '18 mins ago', unread: 0 },
      { id: 5, customer: 'Eve Taylor', message: 'Refund request for order', time: '25 mins ago', unread: 3 }
    ];
    setRecentChats(mockChats);

    const mockReports = [
      { id: 1, title: 'Sales Report', description: 'Monthly sales performance analysis', time: '2 hours ago', status: 'completed' },
      { id: 2, title: 'Product Gross Eagles', description: 'Top performing products overview', time: '5 hours ago', status: 'processing' }
    ];
    setRecentReports(mockReports);

    const mockServices = [
      { id: 1, service: 'Edward Tacker', description: 'System maintenance completed', time: '1 hour ago' },
      { id: 2, service: 'Sarah Asih', description: 'Database optimization in progress', time: '3 hours ago' },
      { id: 3, service: 'Agus Suyitanto', description: 'Server backup completed successfully', time: '6 hours ago' }
    ];
    setRecentServices(mockServices);
  }, []);

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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart data
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
          <h1 className="text-2xl font-bold text-gray-900">Master Dashboard</h1>
          <p className="text-gray-600">Master control panel overview and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-600 text-gray-600 rounded-lg text-sm">
            <FiCalendar className="mr-2" />
            {selectedPeriod}
          </button>
          <button className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700">
            <FiFilter className="mr-2" />
            Export
          </button>
        </div>
      </div>

    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {masterStats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className={`${stat.color} p-2 rounded-md w-10 h-10 flex items-center justify-center mb-3`}>
                <stat.icon className="text-white" size={16} />
              </div>
              <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div> */}
    <CardAdmin />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Product Sales</h3>
              <p className="text-gray-600">Sales performance over time</p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="7 days">Last 7 days</option>
                <option value="30 days">Last 30 days</option>
                <option value="90 days">Last 90 days</option>
              </select>
            </div>
          </div>

          <div className="h-64 bg-yellow-50 rounded-lg p-4">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Chart Grid */}
              <defs>
                <pattern id="grid" width="57" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 57 0 L 0 0 0 40" fill="none" stroke="#fef3c7" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Chart Line */}
              <polyline
                fill="none"
                stroke="#f59e0b"
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
                  fill="#f59e0b"
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
                  className="text-xs fill-gray-600"
                >
                  {point.day}
                </text>
              ))}
            </svg>
          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Total Sales: Rp 98,231,890</span>
            <span className="text-green-600">↗ +18.2% from last period</span>
          </div>
        </div>

        {/* Recent User Reports */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent User Reports</h3>
            <Link href="/master/reports" className="text-slate-600 hover:text-slate-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm flex items-center">
                      {report.title}
                      <FiExternalLink className="ml-2 text-gray-400" size={12} />
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{report.time}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Product Sale - Grid layout seperti gambar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Best Product Sale</h3>
          <Link href="/master/products" className="text-slate-600 hover:text-slate-700 text-sm">
            View All
          </Link>
        </div>
        
        {/* Grid layout dengan background pink */}
        <div className="bg-pink-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestProducts.slice(0, 8).map((product, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-pink-100 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <FiPackage className="text-gray-400" size={24} />
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{product.name}</h4>
                <div className="flex items-center mb-2">
                  <FiStar className="text-yellow-400 mr-1" size={12} />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                <p className="text-xs text-gray-500">{product.sales} sold</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid - Recent Orders & Customer Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link href="/master/orders" className="text-slate-600 hover:text-slate-700 text-sm">
                View All
              </Link>
            </div>
          </div>
          
          {/* Table Headers */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-7 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
              <span>No</span>
              <span>Product</span>
              <span>Product Name</span>
              <span>Quantity</span>
              <span>Total Price</span>
              <span>Buyer Name</span>
              <span>Status</span>
            </div>
          </div>
          
          {/* Table Content */}
          <div className="p-6">
            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-4 text-sm py-3 border-b border-gray-100">
                <span className="text-gray-900">#001</span>
                <span className="text-gray-600">WH-123</span>
                <span className="text-gray-900">Sonic Atom</span>
                <span className="text-gray-600">3</span>
                <span className="text-gray-900 font-medium">Rp 450,000</span>
                <span className="text-gray-600">Edward Tacker</span>
                <span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Success
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Customer Service */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Customer Service</h3>
            <Link href="/master/messages" className="text-slate-600 hover:text-slate-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentServices.map((service, index) => (
              <div key={index} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 text-sm">{service.service}</span>
                  <span className="text-xs text-gray-500">{service.time}</span>
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
