'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiEdit,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiShoppingBag,
  FiTrendingUp,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiEye,
  FiDownload,
  FiExternalLink
} from 'react-icons/fi';

export default function ShopsPage() {
  const [shopData] = useState({
    name: 'Hakkam Store',
    ownerName: 'Hakkam Robbani',
    address: 'Jl. Lodaya, Kota Bogor',
    email: 'hakkam@botmail.com',
    phone: '+62 812 3456 7890',
    website: 'https://hakkamstore.com',
    description: 'Premium electronics and gadgets store specializing in quality products with excellent customer service.',
    status: 'active',
    statusReason: '',
    shopImage: '/api/placeholder/150/150',
    category: 'Electronics',
    establishedDate: '2022-01-15',
    businessLicense: 'BL-2022-001234',
    taxId: 'TAX-567890123'
  });

  const [stats] = useState({
    totalOrders: 420,
    totalSales: 69,
    reportsAgainst: 420,
    reportsMade: 69,
    lastLogin: 'Tomorrow',
    avgRating: 4.8,
    totalProducts: 156,
    activeProducts: 142
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'order',
      description: 'New order #ORD-2024-891 received',
      timestamp: '2024-10-22T10:30:00Z',
      amount: '$89.99'
    },
    {
      id: 2,
      type: 'product',
      description: 'Added new product: Wireless Earbuds Pro',
      timestamp: '2024-10-22T09:15:00Z',
      amount: null
    },
    {
      id: 3,
      type: 'review',
      description: 'Received 5-star review from customer',
      timestamp: '2024-10-22T08:45:00Z',
      amount: null
    },
    {
      id: 4,
      type: 'payment',
      description: 'Payment processed for order #ORD-2024-890',
      timestamp: '2024-10-21T16:20:00Z',
      amount: '$156.50'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <FiShoppingBag className="h-4 w-4 text-blue-500" />;
      case 'product':
        return <FiFileText className="h-4 w-4 text-green-500" />;
      case 'review':
        return <FiCheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'payment':
        return <FiTrendingUp className="h-4 w-4 text-purple-500" />;
      default:
        return <FiFileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shop Information</h1>
            <p className="text-gray-600">Manage shop details and settings</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/admin/shops/edit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            Edit Information
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Shop Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Shop Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <Image
                  src={shopData.shopImage}
                  alt={shopData.name}
                  width={120}
                  height={120}
                  className="rounded-full mx-auto"
                  unoptimized
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{shopData.name}</h3>
              <p className="text-gray-600">{shopData.ownerName}</p>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shopData.status)}`}>
                  {shopData.status}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="text-sm">
                <div className="flex items-center text-gray-600 mb-1">
                  <FiClock className="h-4 w-4 mr-2" />
                  Last Login
                </div>
                <p className="font-medium text-gray-900">{stats.lastLogin}</p>
              </div>
              
              <div className="text-sm">
                <div className="flex items-center text-gray-600 mb-1">
                  <FiShoppingBag className="h-4 w-4 mr-2" />
                  Total Orders
                </div>
                <p className="font-medium text-gray-900">{stats.totalOrders}</p>
              </div>
              
              <div className="text-sm">
                <div className="flex items-center text-gray-600 mb-1">
                  <FiTrendingUp className="h-4 w-4 mr-2" />
                  Total Sales
                </div>
                <p className="font-medium text-gray-900">{stats.totalSales}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reports Made</span>
                <span className="text-sm font-medium text-gray-900">{stats.reportsMade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reports Against</span>
                <span className="text-sm font-medium text-red-600">{stats.reportsAgainst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <span className="text-sm font-medium text-yellow-600">★ {stats.avgRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Products</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Products</span>
                <span className="text-sm font-medium text-green-600">{stats.activeProducts}</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 text-sm text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50">
              See Reports History
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                <div className="flex items-center">
                  <p className="text-gray-900">{shopData.name}</p>
                  <FiExternalLink className="ml-2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                <p className="text-gray-900">{shopData.ownerName}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="flex items-center">
                  <FiMapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{shopData.address}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center">
                  <FiMail className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{shopData.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="flex items-center">
                  <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{shopData.phone}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <div className="flex items-center">
                  <FiGlobe className="h-4 w-4 text-gray-400 mr-2" />
                  <a href={shopData.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                    {shopData.website}
                  </a>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-gray-900">{shopData.description}</p>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Status Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(shopData.status)}`}>
                  {shopData.status}
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Change Reason</label>
                <p className="text-gray-900">{shopData.statusReason || 'No status change reason provided'}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {/* <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                      {activity.amount && (
                        <span className="text-sm font-medium text-green-600">{activity.amount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
