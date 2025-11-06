'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiAlertTriangle,
  FiSearch, 
  FiFilter,
  FiEye,
  FiFlag,
  FiMessageSquare,
  FiShoppingBag,
  FiPackage,
  FiUser,
  FiCalendar,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiFileText
} from 'react-icons/fi';

export default function ReportsManagementPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    // Mock reports data - replace with actual API call
    const mockReports = [
      {
        id: '1',
        reporterName: 'John Doe',
        reporterEmail: 'john.doe@email.com',
        reportType: 'shop',
        targetName: 'Jane Fashion Store',
        targetId: 'shop_2',
        subject: 'Produk tidak sesuai deskripsi',
        message: 'Saya membeli dress dari toko ini tetapi yang dikirim berbeda dengan foto. Ukuran tidak sesuai dan bahan terasa murahan. Saya merasa tertipu dengan iklan yang ditampilkan.',
        priority: 'high',
        status: 'new',
        submittedAt: '2024-01-21T14:30:00Z',
        category: 'Product Quality',
        attachments: ['evidence1.jpg', 'evidence2.jpg']
      },
      {
        id: '2',
        reporterName: 'Sarah Wilson',
        reporterEmail: 'sarah.wilson@email.com',
        reportType: 'product',
        targetName: 'Wireless Headphones Pro Max',
        targetId: 'product_156',
        subject: 'Produk rusak saat diterima',
        message: 'Headphone yang saya terima dalam kondisi rusak. Bagian ear cup kiri tidak berfungsi dengan baik dan ada retakan pada headband. Packaging juga terlihat sudah pernah dibuka sebelumnya.',
        priority: 'medium',
        status: 'reviewed',
        submittedAt: '2024-01-20T11:15:00Z',
        reviewedAt: '2024-01-21T09:30:00Z',
        category: 'Product Damage',
        attachments: ['damage_photo.jpg']
      },
      {
        id: '3',
        reporterName: 'Ahmad Rahman',
        reporterEmail: 'ahmad.rahman@email.com',
        reportType: 'shop',
        targetName: 'Tech Solutions Store',
        targetId: 'shop_5',
        subject: 'Pelayanan customer service buruk',
        message: 'Customer service dari toko ini sangat tidak responsif. Sudah 3 hari saya menanyakan status pengiriman tetapi tidak ada respon sama sekali. Chat diabaikan dan phone tidak diangkat.',
        priority: 'medium',
        status: 'resolved',
        submittedAt: '2024-01-19T16:45:00Z',
        reviewedAt: '2024-01-20T10:20:00Z',
        resolvedAt: '2024-01-21T14:15:00Z',
        category: 'Customer Service',
        attachments: []
      },
      {
        id: '4',
        reporterName: 'Michael Chen',
        reporterEmail: 'michael.chen@email.com',
        reportType: 'product',
        targetName: 'Smart Watch Series X',
        targetId: 'product_89',
        subject: 'Produk palsu/KW',
        message: 'Smart watch yang saya beli ternyata barang KW/palsu. Build quality sangat buruk, fitur-fitur yang diiklankan tidak ada, dan logo brand terlihat tidak original. Ini jelas penipuan!',
        priority: 'high',
        status: 'new',
        submittedAt: '2024-01-21T10:20:00Z',
        category: 'Counterfeit Product',
        attachments: ['fake_product1.jpg', 'fake_product2.jpg', 'original_comparison.jpg']
      },
      {
        id: '5',
        reporterName: 'Lisa Park',
        reporterEmail: 'lisa.park@email.com',
        reportType: 'shop',
        targetName: 'Healthy Food Corner',
        targetId: 'shop_8',
        subject: 'Pengiriman terlambat dan makanan basi',
        message: 'Pesanan makanan organic saya terlambat 2 hari dari jadwal. Ketika sampai, beberapa sayuran sudah layu dan buah-buahan ada yang busuk. Sangat kecewa dengan kualitas dan ketepatan waktu pengiriman.',
        priority: 'high',
        status: 'reviewed',
        submittedAt: '2024-01-18T13:10:00Z',
        reviewedAt: '2024-01-19T11:45:00Z',
        category: 'Delivery Issue',
        attachments: ['spoiled_food.jpg']
      },
      {
        id: '6',
        reporterName: 'David Kumar',
        reporterEmail: 'david.kumar@email.com',
        reportType: 'product',
        targetName: 'Gaming Laptop Ultra',
        targetId: 'product_245',
        subject: 'Spesifikasi tidak sesuai iklan',
        message: 'Laptop gaming yang saya beli ternyata spesifikasinya berbeda dengan yang diiklankan. RAM hanya 8GB bukan 16GB, dan VGA yang dipasang adalah model yang lebih rendah. Merasa dibohongi oleh seller.',
        priority: 'medium',
        status: 'new',
        submittedAt: '2024-01-21T09:45:00Z',
        category: 'False Advertisement',
        attachments: ['spec_screenshot.jpg', 'actual_spec.jpg']
      }
    ];

    // Simulate API call
    const fetchReports = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReports(mockReports);
        setFilteredReports(mockReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.reportType === typeFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, typeFilter, priorityFilter]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <FiAlertCircle className="h-4 w-4" />;
      case 'reviewed':
        return <FiClock className="h-4 w-4" />;
      case 'resolved':
        return <FiCheckCircle className="h-4 w-4" />;
      case 'closed':
        return <FiXCircle className="h-4 w-4" />;
      default:
        return <FiFileText className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'shop':
        return <FiShoppingBag className="h-4 w-4 text-blue-600" />;
      case 'product':
        return <FiPackage className="h-4 w-4 text-green-600" />;
      default:
        return <FiFlag className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="rounded bg-gray-300 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports Monitoring</h1>
            <p className="text-sm text-gray-500">Monitor and review user reports about shops and products</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="shop">Shop Reports</option>
                <option value="product">Product Reports</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFlag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              >
                <option value="all">All Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-500">
                Showing {filteredReports.length} of {reports.length} reports
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
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
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="shrink-0 mt-1">
                        {getTypeIcon(report.reportType)}
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {report.subject}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {report.message.length > 100 
                            ? `${report.message.substring(0, 100)}...` 
                            : report.message
                          }
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                            {report.category}
                          </span>
                          {report.attachments.length > 0 && (
                            <span className="ml-2 text-xs text-gray-500 flex items-center">
                              <FiFileText className="mr-1 h-3 w-3" />
                              {report.attachments.length} file(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.reporterName}</div>
                        <div className="text-sm text-gray-500">{report.reporterEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{report.targetName}</div>
                    <div className="text-sm text-gray-500 capitalize">{report.reportType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{report.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1 h-4 w-4 text-gray-400" />
                      {new Date(report.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      href={`/master/reports/${report.id}`}
                      className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-gray-100" 
                      title="View Report Details"
                    >
                      <FiEye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || typeFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No reports have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
