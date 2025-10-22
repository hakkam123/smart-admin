'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiPackage,
  FiCalendar,
  FiClock,
  FiAlertTriangle,
  FiMessageSquare,
  FiEdit,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiDownload,
  FiPrinter
} from 'react-icons/fi';

export default function ReportDetailPage({ params }) {
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('high');
  const [assignedTo, setAssignedTo] = useState('Sarah Wilson');

  // Mock data - in real app, fetch based on params.id
  const report = {
    id: 'RPT-001',
    customer: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 234-567-8900',
      address: '123 Main Street, New York, NY 10001',
      joinDate: '2023-05-15'
    },
    product: {
      name: 'Wireless Bluetooth Headphones',
      sku: 'WBH-001',
      image: '/api/placeholder/120/120',
      price: '$89.99',
      category: 'Electronics',
      warranty: '1 Year'
    },
    issue: 'Product not working after 2 weeks of use',
    description: 'The headphones stopped charging and the left speaker is not working. Customer tried different charging cables but the issue persists. The product was working fine initially but started having issues after approximately 2 weeks of normal usage.',
    priority: 'high',
    status: 'pending',
    category: 'defective',
    reportDate: '2024-10-22T10:30:00Z',
    responseTime: '2 hours',
    assignedTo: 'Sarah Wilson',
    orderNumber: 'ORD-2024-0891',
    purchaseDate: '2024-10-08',
    attachments: [
      { name: 'product_image_1.jpg', size: '2.4 MB', type: 'image' },
      { name: 'receipt.pdf', size: '1.1 MB', type: 'pdf' }
    ]
  };

  const timeline = [
    {
      id: 1,
      action: 'Complaint submitted',
      user: 'John Smith',
      timestamp: '2024-10-22T10:30:00Z',
      type: 'submission',
      details: 'Customer reported product defect via contact form'
    },
    {
      id: 2,
      action: 'Report acknowledged',
      user: 'Sarah Wilson',
      timestamp: '2024-10-22T12:30:00Z',
      type: 'acknowledgment',
      details: 'Initial response sent to customer'
    },
    {
      id: 3,
      action: 'Under investigation',
      user: 'Sarah Wilson',
      timestamp: '2024-10-22T14:15:00Z',
      type: 'investigation',
      details: 'Technical team assigned to investigate the issue'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <Link 
            href="/admin/reports"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
            <p className="text-gray-600">Complaint #{report.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Report Overview</h2>
              <div className="flex space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
                  {report.priority} Priority
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                <p className="text-sm text-gray-900">{report.issue}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900 leading-relaxed">{report.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
                  <p className="text-sm text-gray-900">{formatDate(report.reportDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Response Time</label>
                  <p className="text-sm text-gray-900">{report.responseTime}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                  <p className="text-sm text-gray-900">{report.orderNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <p className="text-sm text-gray-900">{new Date(report.purchaseDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Information</h2>
            <div className="flex items-start space-x-4">
              <Image
                src={report.product.image}
                alt={report.product.name}
                width={120}
                height={120}
                className="rounded-lg object-cover"
                unoptimized
              />
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <p className="text-sm text-gray-900 font-medium">{report.product.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <p className="text-sm text-gray-900">{report.product.sku}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <p className="text-sm text-gray-900">{report.product.price}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <p className="text-sm text-gray-900">{report.product.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
                    <p className="text-sm text-gray-900">{report.product.warranty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {report.attachments && report.attachments.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Attachments</h2>
              <div className="space-y-3">
                {report.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded">
                        <FiFileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{attachment.size}</p>
                      </div>
                    </div>
                    <button className="text-orange-600 hover:text-orange-900 text-sm font-medium">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h2>
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <div className={`w-3 h-3 mt-2 rounded-full ${
                    item.type === 'submission' ? 'bg-red-500' :
                    item.type === 'acknowledgment' ? 'bg-blue-500' :
                    item.type === 'investigation' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                    </div>
                    <p className="text-sm text-gray-600">{item.details}</p>
                    <p className="text-xs text-gray-500">by {item.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <FiUser className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.customer.name}</p>
                  <p className="text-xs text-gray-500">Customer since {new Date(report.customer.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <FiMail className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{report.customer.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <FiPhone className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{report.customer.phone}</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                <p className="text-sm text-gray-900 mt-1">{report.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Report Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Report Management</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <select 
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Sarah Wilson">Sarah Wilson</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Emily Brown">Emily Brown</option>
                  <option value="Alex Chen">Alex Chen</option>
                </select>
              </div>
              
              <button className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:from-orange-600 hover:to-orange-700 font-medium">
                Update Report
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FiMessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FiCheckCircle className="mr-2 h-4 w-4" />
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
