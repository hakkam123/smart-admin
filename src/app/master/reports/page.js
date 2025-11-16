 'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
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
  const { getToken } = useAuth();

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

        const res = await axios.get(`${API_BASE}/api/admin/reports`, { headers });
        if (res.data && res.data.reports) {
          const normalized = res.data.reports.map(r => ({
            ...r,
            reportType: r.reportType ? String(r.reportType).toLowerCase() : r.reportType,
            priority: r.priority ? String(r.priority).toLowerCase() : r.priority,
            suggestedPriority: r.suggestedPriority ? String(r.suggestedPriority).toLowerCase() : r.suggestedPriority,
            status: r.status ? String(r.status).toLowerCase() : r.status,
            reporterName: r.reporter?.name || r.user?.name || r.reporterName || '',
            reporterEmail: r.reporter?.email || r.user?.email || r.reporterEmail || '',
            targetName: r.store?.name || r.product?.name || r.targetId?.name,
          }));
          console.log('Normalized reports:', normalized);
          setReports(normalized);
          setFilteredReports(normalized);
        } else {
          setReports([]);
          setFilteredReports([]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [getToken]);

  useEffect(() => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        (report.reporterName || '').toLowerCase().includes(q) ||
        (report.targetName || '').toLowerCase().includes(q) ||
        (report.subject || '').toLowerCase().includes(q) ||
        (report.message || '').toLowerCase().includes(q) ||
        (report.category || '').toLowerCase().includes(q)
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.reportType === typeFilter);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, typeFilter]);

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
      case 'store':
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
              className="inline-flex items-center px-4 py-2 text-[12px] bg-slate-600 text-sm text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="block w-full pl-10 pr-10 py-2 border text-gray-500 border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="store">Store Reports</option>
                <option value="product">Product Reports</option>
              </select>
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
              {searchTerm || typeFilter !== 'all'
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