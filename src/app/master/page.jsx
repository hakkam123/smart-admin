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
  const [selectedPeriod, setSelectedPeriod] = useState('7 hari');
  const [liveOrders, setLiveOrders] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [recentServices, setRecentServices] = useState([]);

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

      <CardAdmin />

      {/* Recent User Reports - Full Width */}
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

      {/* Best Product Sale - List layout */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Best Product Sale</h3>
          <Link href="/master/products" className="text-slate-600 hover:text-slate-700 text-sm">
            View All
          </Link>
        </div>
        
        {/* List layout */}
        <div className="space-y-3">
          {bestProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <FiPackage className="text-gray-400" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                  <div className="flex items-center mt-1">
                    <FiStar className="text-yellow-400 mr-1" size={14} />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                    <span className="text-xs text-gray-400 mx-2">•</span>
                    <span className="text-xs text-gray-600">{product.sales} sold</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                <span className="text-green-600 text-xs font-medium">{product.change}</span>
              </div>
            </div>
          ))}
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
