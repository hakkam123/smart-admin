'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiArrowLeft,
  FiUser,
  FiMail,
  FiCalendar,
  FiFlag,
  FiMessageSquare,
  FiShoppingBag,
  FiPackage,
  FiFileText,
  FiImage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiExternalLink,
  FiRefreshCw
} from 'react-icons/fi';

export default function ReportDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { getToken } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
        const headers = {};
        
        if (getToken) {
          try {
            const token = await getToken();
            if (token) headers.Authorization = `Bearer ${token}`;
          } catch (err) {
            console.warn('Failed to get Clerk token', err);
          }
        }

        const response = await axios.get(`${API_BASE}/api/admin/reports/${id}`, { headers });
        
        if (response.data && response.data.report) {
          const normalizedReport = {
            ...response.data.report,
            reportType: response.data.report.reportType ? String(response.data.report.reportType).toLowerCase() : response.data.report.reportType,
            priority: response.data.report.priority ? String(response.data.report.priority).toLowerCase() : response.data.report.priority,
            suggestedPriority: response.data.report.suggestedPriority ? String(response.data.report.suggestedPriority).toLowerCase() : response.data.report.suggestedPriority,
            status: response.data.report.status ? String(response.data.report.status).toLowerCase() : response.data.report.status,
            reporterName: response.data.report.reporter?.name || response.data.report.user?.name || response.data.report.reporterName || '',
            reporterEmail: response.data.report.reporter?.email || response.data.report.user?.email || response.data.report.reporterEmail || '',
            targetName: response.data.report.store?.name || response.data.report.product?.name || response.data.report.targetId?.name || '',
          };
          
          console.log('Report detail:', normalizedReport);
          setReport(normalizedReport);
        } else {
          setError('Report not found');
        }
      } catch (err) {
        console.error('Error fetching report detail:', err);
        setError('Failed to load report details');
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [id, getToken]);

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'store':
        return <FiShoppingBag className="h-5 w-5 text-blue-600" />;
      case 'product':
        return <FiPackage className="h-5 w-5 text-green-600" />;
      default:
        return <FiFlag className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Report</h3>
          <p className="mt-1 text-sm text-gray-500">{error || 'Report not found'}</p>
          <div className="mt-6">
            <Link
              href="/master/reports"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Reports
            </Link>
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
          <div className="flex items-center space-x-4">
            <Link
              href="/master/reports"
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
              <p className="text-sm text-gray-500">Report ID: {report.id}</p>
            </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(report.reportType)}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{report.subject}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500 capitalize">{report.reportType} Report</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{report.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span className="ml-1 capitalize">{report.status}</span>
                  </span>
                  {report.priority && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
                      Priority: {report.priority}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Message</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{report.message}</p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {report.attachments && report.attachments.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attachments ({report.attachments.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.attachments.map((attachment, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={attachment}
                          alt={`Attachment ${index + 1}`}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          unoptimized
                        />
                      </div>
                      <div className="absolute top-2 right-2">
                        <a
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-75 transition-colors"
                        >
                          <FiExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Target Information */}
          {(report.product || report.store) && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {report.reportType === 'product' ? 'Product Information' : 'Store Information'}
                </h3>
                {report.product && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Product Name:</span>
                      <span className="text-sm text-gray-900">{report.product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <span className="text-sm text-gray-900 text-right max-w-xs">{report.product.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Price:</span>
                      <span className="text-sm text-gray-900">Rp {report.product.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">MRP:</span>
                      <span className="text-sm text-gray-900">Rp {report.product.mrp?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                {report.store && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Store Name:</span>
                      <span className="text-sm text-gray-900">{report.store.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <span className="text-sm text-gray-900 text-right max-w-xs">{report.store.description}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporter Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiUser className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{report.reporterName}</div>
                    <div className="text-sm text-gray-500">Reporter</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMail className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{report.reporterEmail}</div>
                    <div className="text-sm text-gray-500">Email</div>
                  </div>
                </div>
                {report.reporter?.image && (
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={report.reporter.image}
                        alt={report.reporterName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="text-sm text-gray-500">Profile Picture</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Submitted</div>
                    <div className="text-sm text-gray-500">
                      {new Date(report.submittedAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                {report.reviewedAt && (
                  <div className="flex items-center space-x-3">
                    <FiClock className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Reviewed</div>
                      <div className="text-sm text-gray-500">
                        {new Date(report.reviewedAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {report.resolvedAt && (
                  <div className="flex items-center space-x-3">
                    <FiCheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Resolved</div>
                      <div className="text-sm text-gray-500">
                        {new Date(report.resolvedAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Report ID:</span>
                  <span className="text-sm text-gray-900">{report.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Target ID:</span>
                  <span className="text-sm text-gray-900">{report.targetId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Reporter ID:</span>
                  <span className="text-sm text-gray-900">{report.reporterId}</span>
                </div>
                {report.suggestedPriority && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Suggested Priority:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.suggestedPriority)}`}>
                      {report.suggestedPriority}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}