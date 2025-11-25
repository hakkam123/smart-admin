'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiAlertTriangle, 
  FiFilter,
  FiDownload,
  FiCalendar,
  FiSearch,
  FiMoreVertical,
  FiEye,
  FiMessageSquare,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

export default function ReportsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample complaint reports data
  const complaintStats = [
    {
      title: 'Total Reports',
      value: '156',
      change: '+12',
      period: 'this month',
      icon: FiAlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'Pending',
      value: '23',
      change: '+5',
      period: 'today',
      icon: FiClock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Resolved',
      value: '98',
      change: '+18',
      period: 'this week',
      icon: FiCheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'High Priority',
      value: '8',
      change: '+2',
      period: 'today',
      icon: FiAlertCircle,
      color: 'bg-orange-500'
    }
  ];

  const complaintReports = [
    {
      id: 'RPT-001',
      customer: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 234-567-8900'
      },
      product: {
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        image: '/api/placeholder/60/60'
      },
      issue: 'Product not working after 2 weeks of use',
      description: 'The headphones stopped charging and the left speaker is not working. Customer tried different charging cables but the issue persists.',
      priority: 'high',
      status: 'pending',
      category: 'defective',
      reportDate: '2024-10-22',
      responseTime: '2 hours',
      assignedTo: 'Sarah Wilson'
    },
    {
      id: 'RPT-002',
      customer: {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1 234-567-8901'
      },
      product: {
        name: 'Smart Fitness Watch',
        sku: 'SFW-002',
        image: '/api/placeholder/60/60'
      },
      issue: 'Incorrect item received',
      description: 'Customer ordered a black fitness watch but received a white one. The packaging was correct but the product inside was wrong.',
      priority: 'medium',
      status: 'in-progress',
      category: 'wrong-item',
      reportDate: '2024-10-21',
      responseTime: '4 hours',
      assignedTo: 'Mike Johnson'
    },
    {
      id: 'RPT-003',
      customer: {
        name: 'David Lee',
        email: 'david.lee@email.com',
        phone: '+1 234-567-8902'
      },
      product: {
        name: 'Laptop Cooling Stand',
        sku: 'LCS-003',
        image: '/api/placeholder/60/60'
      },
      issue: 'Product damaged during shipping',
      description: 'The laptop stand arrived with a broken leg and scratches on the surface. The packaging was also damaged.',
      priority: 'medium',
      status: 'resolved',
      category: 'damaged',
      reportDate: '2024-10-20',
      responseTime: '1 hour',
      assignedTo: 'Emily Brown'
    },
    {
      id: 'RPT-004',
      customer: {
        name: 'Lisa Johnson',
        email: 'lisa.johnson@email.com',
        phone: '+1 234-567-8903'
      },
      product: {
        name: 'USB-C Cable Set',
        sku: 'USC-004',
        image: '/api/placeholder/60/60'
      },
      issue: 'Poor product quality',
      description: 'The USB-C cables stop working after a few days. Customer has tried multiple cables from the set and all have the same issue.',
      priority: 'high',
      status: 'pending',
      category: 'quality',
      reportDate: '2024-10-22',
      responseTime: '30 minutes',
      assignedTo: 'Alex Chen'
    },
    {
      id: 'RPT-005',
      customer: {
        name: 'Robert Wilson',
        email: 'robert.wilson@email.com',
        phone: '+1 234-567-8904'
      },
      product: {
        name: 'Wireless Phone Charger',
        sku: 'WPC-005',
        image: '/api/placeholder/60/60'
      },
      issue: 'Missing accessories',
      description: 'The wireless charger was delivered without the power adapter and USB cable that should be included in the package.',
      priority: 'low',
      status: 'resolved',
      category: 'missing-parts',
      reportDate: '2024-10-19',
      responseTime: '6 hours',
      assignedTo: 'Sarah Wilson'
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

  const filteredReports = complaintReports.filter(report => {
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || report.priority === selectedPriority;
    const matchesSearch = searchTerm === '' || 
      report.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Complaint Reports</h1>
          <p className="text-gray-600">Manage and track customer product complaints</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <FiCalendar className="mr-2 h-4 w-4" />
            Date Range
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complaintStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center text-sm">
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span className="text-gray-500 ml-1">{stat.period}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by customer, product, or complaint ID..."
                className="pl-10 pr-4 py-2 border border-gray-300 text-gray-600 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{report.customer.name}</div>
                        <div className="text-sm text-gray-500">{report.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10">
                        <Image 
                          className="h-10 w-10 rounded object-cover" 
                          src={report.product.image} 
                          alt={report.product.name}
                          width={40}
                          height={40}
                          unoptimized
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{report.product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {report.product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={report.description}>
                      {report.issue}
                    </div>
                    <div className="text-sm text-gray-500">
                      Response: {report.responseTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(report.reportDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="items-center space-x-2">
                      <Link 
                        href={`/admin/reports/${report.id}`}
                        className="text-orange-600 hover:text-orange-900" 
                        title="View Details"
                      >
                        <FiEye className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No complaint reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredReports.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredReports.length}</span> of{' '}
                  <span className="font-medium">{complaintReports.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center bg-orange-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    2
                  </button>
                  <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
