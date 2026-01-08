'use client'

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7 hari');

  const { getToken } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  // inline SVG placeholder to avoid calling /api/placeholder
  const IMAGE_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="10">No Image</text></svg>';

  // Complaint stats derived from fetched `reports`
  const complaintStats = useMemo(() => {
    const total = reports.length;
    const lower = (s) => String(s || '').toLowerCase();

    // month boundaries (local time)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthStart = new Date(year, month, 1);
    const nextMonthStart = new Date(year, month + 1, 1);

    const inCurrentMonth = (ts) => {
      if (!ts) return false;
      const d = new Date(ts);
      return d >= monthStart && d < nextMonthStart;
    };

    const totalThisMonth = reports.filter(r => inCurrentMonth(r.submittedAt || r.reportDate)).length;
    const newThisMonth = reports.filter(r => lower(r.status) === 'new' && inCurrentMonth(r.submittedAt || r.reportDate)).length;
    const resolvedThisMonth = reports.filter(r => (r.resolvedAt || null) && inCurrentMonth(r.resolvedAt)).length;
  // priority statistics removed

    const makeEntry = (title, value, monthCount, icon, color) => ({
      title,
      value: String(value),
      change: monthCount > 0 ? `+${monthCount}` : '',
      period: monthCount > 0 ? 'this month' : 'No monthly report for this month.',
      icon,
      color
    });

    return [
      makeEntry('Total Reports', total, totalThisMonth, FiAlertTriangle, 'bg-red-500'),
      makeEntry('New', reports.filter(r => lower(r.status) === 'new').length, newThisMonth, FiClock, 'bg-yellow-500'),
      makeEntry('Resolved', reports.filter(r => lower(r.status) === 'resolved').length, resolvedThisMonth, FiCheckCircle, 'bg-green-500'),
  // High Priority stat removed
    ];
  }, [reports]);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

    const fetchReports = async () => {
      setLoading(true);
      try {
        const headers = {};
        if (getToken) {
          try {
            const token = await getToken();
            if (token) headers.Authorization = `Bearer ${token}`;
          } catch (err) {
            console.warn('Failed to get Clerk token', err);
          }
        }

  // request product-only reports from the store-scoped API
  const res = await axios.get(`${API_BASE}/api/store/reports?type=product`, { headers });
        if (res.data && res.data.reports) {
          const normalized = res.data.reports.map(r => {
            // helper: format diff into hours/days per spec
            const formatTimeAgo = (ts) => {
              if (!ts) return '';
              const t = new Date(ts).getTime();
              if (Number.isNaN(t)) return '';
              const diffMs = Date.now() - t;
              const hourMs = 1000 * 60 * 60;
              if (diffMs < hourMs) return 'less than 1 hour';
              const hours = Math.floor(diffMs / hourMs);
              if (hours < 24) return `${hours} hours`;
              const days = Math.floor(hours / 24);
              return `${days} days`;
            };

            let responseTimestamp = r.submittedAt || null;
            if (r.status === 'IN_PROGRESS') {
              if (r.reviewedAt) responseTimestamp = r.reviewedAt;
            }
            if (r.status === 'RESOLVED') {
              if (r.resolvedAt) responseTimestamp = r.resolvedAt;
            }

            // last updated = newest of submittedAt, reviewedAt, resolvedAt
            const timestamps = [r.submittedAt, r.reviewedAt, r.resolvedAt].filter(Boolean).map(x => new Date(x).getTime());
            const lastUpdatedTs = timestamps.length ? Math.max(...timestamps) : null;

            const responseTimeStr = responseTimestamp ? formatTimeAgo(responseTimestamp) : '';
            const lastUpdatedAgo = lastUpdatedTs ? formatTimeAgo(new Date(lastUpdatedTs).toISOString()) : '';

            return {
              id: r.id,
              // raw reporter for fallback if needed
              reporter: r.reporter || null,
              // preserve raw timestamps for accurate stats
              submittedAt: r.submittedAt || null,
              reviewedAt: r.reviewedAt || null,
              resolvedAt: r.resolvedAt || null,
              reportType: r.reportType ? String(r.reportType).toLowerCase() : (r.product ? 'product' : 'store'),
              customer: {
                name: r.reporter?.name || r.reporterName || 'Unknown',
                email: r.reporter?.email || r.reporterEmail || ''
              },
              product: r.product ? {
                name: r.product.name,
                sku: r.product.sku || '',
                image: Array.isArray(r.product.images) && r.product.images.length ? r.product.images[0] : IMAGE_PLACEHOLDER
              } : { name: r.store?.name || 'Store', sku: '', image: r.store?.logo || IMAGE_PLACEHOLDER },
              issue: r.subject || r.issue || '',
              description: r.message || '',
              priority: r.priority ? String(r.priority).toLowerCase() : '',
              status: r.status ? String(r.status).toLowerCase() : '',
              category: r.category || '',
              reportDate: r.submittedAt || r.reportDate || null,
              responseTime: responseTimeStr,
              lastUpdatedAgo,
            };
          });
          console.log('Fetched reports:', normalized);

          // ensure only product reports are shown (defensive client-side filter)
          const productOnly = normalized.filter(r => r.reportType === 'product');
          setReports(productOnly);
        } else {
          setReports([]);
        }
      } catch (error) {
        console.error('Error fetching store reports:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [getToken]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusLabel = (status) => {
    if (!status) return '';
    return String(status).replace(/_/g, ' ').replace(/-/g, ' ');
  };

  // priority coloring removed along with priority UI

  const filteredReports = reports.filter(report => {
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = q === '' ||
      (report.customer?.name || '').toLowerCase().includes(q) ||
      (report.product?.name || '').toLowerCase().includes(q) ||
      (report.issue || '').toLowerCase().includes(q) ||
      (report.id || '').toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
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
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
              <option value="escalated">Escalated</option>
            </select>
            {/* priority filter removed */}
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
                {/* Priority column removed */}
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
                        <div className="text-sm font-medium text-gray-900">{report.customer?.name || report.reporter?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{report.customer?.email || report.reporter?.email || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10">
                        <Image 
                          className="h-10 w-10 rounded object-cover" 
                          src={report.product.image||report.store?.image}  
                          alt={report.product.name}
                          width={40}
                          height={40}
                          unoptimized
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{report.product.name}</div>
                        {report.reportType === 'product' && report.product?.sku && (
                          <div className="text-sm text-gray-500">SKU: {report.product.sku}</div>
                        )}
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
                  {/* Priority cell removed */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {formatStatusLabel(report.status)}
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
                  <span className="font-medium">{reports.length}</span> results
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
