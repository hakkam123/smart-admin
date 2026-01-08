"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
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

export default function ReportDetailPage() {
  const { getToken } = useAuth();
  const routeParams = useParams();
  const [status, setStatus] = useState('new');
  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rp. ';
  const IMAGE_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="14">No Image</text></svg>';
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
    const fetchReport = async () => {
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

        const id = routeParams?.id;
        if (!id) {
          setReport(null);
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API_BASE}/api/store/reports/${id}`, { headers });
        if (res.data && res.data.report) {
          const r = res.data.report;

          const normalized = {
            id: r.id,
            reportType: r.reportType ? String(r.reportType).toLowerCase() : (r.product ? 'product' : 'store'),
            customer: (() => {
                const addr = Array.isArray(r.reporter?.Address) && r.reporter.Address.length ? r.reporter.Address[0] : null;
                return {
                  name: r.reporter?.name || 'Unknown',
                  email: r.reporter?.email || '',
                  phone: addr?.phone || 'No phone added',
                  address: addr ? `${addr.street || ''}${addr.city ? ', ' + addr.city : ''}${addr.state ? ', ' + addr.state : ''}` : 'No added address',
                  joinDate: r.reporter?.createdAt || null,
                };
              })(),
            reporter: {
              id: r.reporter?.id || null,
              name: r.reporter?.name || null,
              email: r.reporter?.email || null,
            },
            product: r.product ? {
              name: r.product.name || 'Product',
              description: r.product.description || '',
              weight: r.product.weight || '',
              image: (Array.isArray(r.product.images) && r.product.images[0]) || r.product.image || IMAGE_PLACEHOLDER,
              price: r.product.price || '',
              mrp: r.product.mrp || '',
              category: (r.product && r.product.category) ? (typeof r.product.category === 'string' ? r.product.category : (r.product.category?.name || '')) : (r.category?.name || ''),
              dimensions: r.product.dimensions || ''
            } : { name: r.store?.name || 'Store', sku: '', image: r.store?.logo || IMAGE_PLACEHOLDER },
            issue: r.subject || r.issue || '',
            description: r.message || '',
            priority: r.priority ? String(r.priority).toLowerCase() : 'medium',
            status: r.status ? String(r.status).toLowerCase() : 'new',
            category: r.category || '',
            reportDate: r.submittedAt || r.reportDate || null,
            responseTime: '',
            assignedTo: r.assignedTo || null,
            orderNumber: r.orderNumber || null,
            purchaseDate: r.purchaseDate || null,
            attachments: Array.isArray(r.attachments) ? r.attachments : [] ,
            // keep raw timestamps
            submittedAt: r.submittedAt || null,
            reviewedAt: r.reviewedAt || null,
            resolvedAt: r.resolvedAt || null,
            rejectedAt: r.rejectedAt || null,
          };

          // compute human-friendly responseTime (use resolvedAt > reviewedAt > submittedAt)
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

          const lastResponseTs = normalized.resolvedAt || normalized.reviewedAt || normalized.submittedAt || normalized.rejectedAt || null;
          normalized.responseTime = lastResponseTs ? formatTimeAgo(lastResponseTs) : '';

          // build timeline from timestamps (include historical events regardless of current status)
          const tl = [];
          if (normalized.submittedAt) {
            tl.push({ id: 't-submitted', action: 'Complaint submitted', user: normalized.customer.name, timestamp: normalized.submittedAt, type: 'submission', details: 'Customer submitted the complaint' });
          }

          // in-progress (use reviewedAt)
          if (normalized.reviewedAt) {
            tl.push({ id: 't-inprogress', action: 'Report in progress', user: 'Seller', timestamp: normalized.reviewedAt, type: 'progress', details: 'Seller started working on the report' });
          }

          // Final status: resolved or rejected. For legacy rows where rejection used resolvedAt, prefer showing rejected when current status is rejected.
          if (String(normalized.status).toLowerCase() === 'rejected') {
            const ts = normalized.rejectedAt || normalized.resolvedAt || null;
            if (ts) tl.push({ id: 't-rejected', action: 'Report rejected', user: 'Seller', timestamp: ts, type: 'resolution', details: 'Report marked as rejected' });
          } else {
            if (normalized.resolvedAt) tl.push({ id: 't-resolved', action: 'Report resolved', user: 'Seller', timestamp: normalized.resolvedAt, type: 'resolution', details: 'Report marked as resolved' });
            if (normalized.rejectedAt) tl.push({ id: 't-rejected', action: 'Report rejected', user: 'Seller', timestamp: normalized.rejectedAt, type: 'resolution', details: 'Report marked as rejected' });
          }

          // sort chronologically (oldest first)
          tl.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

          setReport(normalized);
          setTimeline(tl);
          setStatus(normalized.status);
        } else {
          setReport(null);
        }
      } catch (err) {
        console.error('Failed to fetch report', err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [routeParams?.id, getToken]);
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

  // priority display removed — helper dropped

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  const ALL_STATUSES = ['NEW','IN_PROGRESS','RESOLVED','REJECTED'];

  // determine statuses that already occurred (don't show them as options)
  // determine statuses that already occurred (don't show them as options)
  const occurred = new Set();
  if (report?.submittedAt) occurred.add('NEW');
  if (report?.reviewedAt) { occurred.add('IN_PROGRESS'); }
  if (report?.resolvedAt) occurred.add('RESOLVED');
  if (report?.rejectedAt) occurred.add('REJECTED');
  if (report?.status) occurred.add(String(report.status).toUpperCase());

  // determine allowed statuses with ordering: cannot go directly to RESOLVED unless already IN_PROGRESS/reviewed
  // Guard against report being null by using optional chaining
  const currentStatusLower = report?.status ? String(report.status).toLowerCase() : null;
  const hasResolved = !!report?.resolvedAt;
  const hasRejected = !!report?.rejectedAt;
  let allowedStatuses = ALL_STATUSES.filter(s => !occurred.has(s));
  if (currentStatusLower === 'resolved' || hasResolved || currentStatusLower === 'rejected' || hasRejected) {
    allowedStatuses = [];
  } else {
    // ensure cannot jump directly to RESOLVED
    if (currentStatusLower !== 'in_progress') {
      // from NEW, only allow moving to IN_PROGRESS (prevent resolving directly)
      allowedStatuses = allowedStatuses.filter(s => s !== 'RESOLVED');
    }
  }

  // Keep the select value in sync with allowedStatuses to avoid sending an invalid/stale value
  useEffect(() => {
    try {
      if (!allowedStatuses || !allowedStatuses.length) return;
      const curUp = status ? String(status).toUpperCase() : null;
      if (!curUp || !allowedStatuses.includes(curUp)) {
        setStatus(String(allowedStatuses[0]).toLowerCase());
      }
    } catch (e) { /* ignore */ }
  }, [JSON.stringify(allowedStatuses)]);

  if (loading) return (<div className="p-6">Loading report...</div>);
  if (!report) return (<div className="p-6">Report not found</div>);

  const formatStatusLabel = (s) => String(s || '').toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');

  // Display helper: show labels in UPPERCASE and convert underscores to spaces
  const formatLabelUpper = (s) => String(s || '').toUpperCase().replace(/_/g, ' ').replace(/-/g, ' ');

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const headers = { 'Content-Type': 'application/json' };
      if (getToken) {
        try {
          const token = await getToken();
          if (token) headers.Authorization = `Bearer ${token}`;
        } catch (err) { console.warn('Failed to get token', err); }
      }

      const id = routeParams?.id;
      if (!id) return;

  // Read the select value directly in case React state is stale
  const selectEl = typeof document !== 'undefined' ? document.getElementById('report-status-select') : null;
  const toSend = selectEl ? String(selectEl.value).toUpperCase() : String(status).toUpperCase();
  console.log('Sending status to server:', toSend);
  const res = await axios.patch(`${API_BASE}/api/store/reports/${id}`, { status: toSend }, { headers });
      if (res.data && res.data.report) {
        // re-normalize by reusing earlier logic (simple approach: refresh page state)
        const r = res.data.report;
        const normalized = {
          id: r.id,
          reportType: r.reportType ? String(r.reportType).toLowerCase() : (r.product ? 'product' : 'store'),
          customer: {
            name: r.reporter?.name || 'Unknown',
            email: r.reporter?.email || ''
          },
          reporter: {
            id: r.reporter?.id || null,
            name: r.reporter?.name || null,
            email: r.reporter?.email || null,
          },
          product: r.product ? {
            name: r.product.name || 'Product',
            mrp: r.product.mrp || '',
            description: r.product.description || '',
            weight: r.product.weight || '',
            image: (Array.isArray(r.product.images) && r.product.images[0]) || r.product.image || IMAGE_PLACEHOLDER,
            price: r.product.price || '',
            category: (r.product && r.product.category) ? (typeof r.product.category === 'string' ? r.product.category : (r.product.category?.name || '')) : (r.category?.name || ''),
            dimensions: r.product.dimensions || ''
          } : { name: r.store?.name || 'Store', mrp: '', image: r.store?.logo || IMAGE_PLACEHOLDER },
          issue: r.subject || r.issue || '',
          description: r.message || '',
          priority: r.priority ? String(r.priority).toLowerCase() : 'medium',
          status: r.status ? String(r.status).toLowerCase() : 'new',
          category: r.category || '',
          reportDate: r.submittedAt || r.reportDate || null,
          responseTime: '',
          orderNumber: r.orderNumber || null,
          purchaseDate: r.purchaseDate || null,
          attachments: Array.isArray(r.attachments) ? r.attachments : [],
          submittedAt: r.submittedAt || null,
          reviewedAt: r.reviewedAt || null,
          resolvedAt: r.resolvedAt || null,
          rejectedAt: r.rejectedAt || null,
        };

        // prefer resolved, then rejected, then submitted for response time
        const lastResponseTs = normalized.resolvedAt || normalized.rejectedAt || normalized.submittedAt || null;
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
        normalized.responseTime = lastResponseTs ? formatTimeAgo(lastResponseTs) : '';

        const tl = [];
        if (normalized.submittedAt) {
          tl.push({ id: 't-submitted', action: 'Complaint submitted', user: normalized.customer.name, timestamp: normalized.submittedAt, type: 'submission', details: 'Customer submitted the complaint' });
        }

        if (normalized.reviewedAt) {
          tl.push({ id: 't-inprogress', action: 'Report in progress', user: 'Seller', timestamp: normalized.reviewedAt, type: 'progress', details: 'Seller started working on the report' });
        }

        if (String(normalized.status).toLowerCase() === 'rejected') {
          const ts = normalized.rejectedAt || normalized.resolvedAt || null;
          if (ts) tl.push({ id: 't-rejected', action: 'Report rejected', user: 'Seller', timestamp: ts, type: 'resolution', details: 'Report marked as rejected' });
        } else {
          if (normalized.resolvedAt) tl.push({ id: 't-resolved', action: 'Report resolved', user: 'Seller', timestamp: normalized.resolvedAt, type: 'resolution', details: 'Report marked as resolved' });
          if (normalized.rejectedAt) tl.push({ id: 't-rejected', action: 'Report rejected', user: 'Seller', timestamp: normalized.rejectedAt, type: 'resolution', details: 'Report marked as rejected' });
        }

        tl.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setReport(normalized);
        setTimeline(tl);
        setStatus(normalized.status);
        window.alert('Status updated');
      }
    } catch (err) {
      console.error('Failed to update status', err);
      window.alert('Failed to update status');
    }
    finally {
      setUpdating(false);
    }
  };

  const handleDownloadAttachment = async (attachment) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const headers = {};
      if (getToken) {
        try {
          const token = await getToken();
          if (token) headers.Authorization = `Bearer ${token}`;
        } catch (err) { /* ignore token errors */ }
      }
      // Resolve URL whether attachment is a plain string (ImageKit URL) or an object
      const url = (typeof attachment === 'string')
        ? attachment
        : (attachment?.url || attachment?.path || (attachment?.id && report?.id ? `${API_BASE}/api/store/reports/${report.id}/attachments/${attachment.id}` : null));
      if (!url) {
        window.alert('No downloadable URL available for this attachment');
        return;
      }
      // Try to fetch as blob and trigger download. If CORS blocks or fetch fails, open URL in new tab.
      try {
        const res = await axios.get(url, { responseType: 'blob', headers });
        const blob = res.data;
        const fileName = (typeof attachment === 'string') ? extractFilenameFromUrl(attachment) : (attachment?.name || extractFilenameFromUrl(url) || `attachment-${Date.now()}`);
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
      } catch (errFetch) {
        // If fetch as blob fails (CORS, signed URLs, etc), open original URL in new tab as a fallback
        console.warn('Blob fetch failed, falling back to opening URL', errFetch);
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Failed to download attachment', err);
      window.alert('Failed to download attachment');
    }
  };

  const extractFilenameFromUrl = (url) => {
    try {
      if (!url) return '';
      const parts = url.split('/');
      const last = parts[parts.length - 1] || parts[parts.length - 2] || url;
      return decodeURIComponent((last || url).split('?')[0]);
    } catch (e) { return url; }
  };

  const calculateDiscount = () => {
    if (report.product?.mrp && report.product?.price && report.product.mrp > report.product.price) {
      return Math.round(((report.product.mrp - report.product.price) / report.product.mrp) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                  {formatLabelUpper(report.status)}
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

                  {report.reportType === 'product' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                        <p className="text-sm text-gray-900">{report.orderNumber || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                        <p className="text-sm text-gray-900">{report.purchaseDate ? new Date(report.purchaseDate).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                  )}
            </div>
          </div>

          {/* Product Information */}
          {report.reportType === 'product' && (
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <p className="text-sm text-gray-900 font-medium">{report.product.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-sm text-gray-900">{report.product.description || '-'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price</label>
                      <p className="text-sm text-gray-900">{report.product.mrp || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
                      <p className="text-sm text-gray-900">{report.product.price || '-'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                      <p className="text-sm text-gray-900">{report.product.weight ? `${report.product.weight} Kg` : '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                      <p className="text-sm text-gray-900">{report.product.dimensions || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attachments */}
          {report.attachments && report.attachments.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Attachments</h2>
              <div className="space-y-3">
                {report.attachments.map((attachment, index) => {
                  const name = (typeof attachment === 'string') ? extractFilenameFromUrl(attachment) : (attachment?.name || extractFilenameFromUrl(attachment?.url || attachment?.path || ''));
                  const size = (typeof attachment === 'string') ? '' : (attachment?.size || '');
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded">
                          <FiFileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{name}</p>
                          {size ? <p className="text-xs text-gray-500">{size}</p> : null}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleDownloadAttachment(attachment)} className="flex items-center text-orange-600 hover:text-orange-900 text-sm font-medium">
                          <FiDownload className="mr-2" />
                          Download
                        </button>
                        <a href={(typeof attachment === 'string') ? attachment : (attachment?.url || attachment?.path || '#')} target="_blank" rel="noreferrer" className="text-gray-500 text-sm hover:underline">Open</a>
                      </div>
                    </div>
                  );
                })}
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
                    item.type === 'progress' ? 'bg-blue-500' :
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
                {String(report.status).toLowerCase() === 'resolved' || report.resolvedAt || String(report.status).toLowerCase() === 'rejected' ? (
                  <p className="text-sm text-gray-900 font-medium">{formatLabelUpper(report.status)}</p>
                ) : (
                  <select id="report-status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={updating}
                  >
                    {allowedStatuses && allowedStatuses.length > 0 ? (
                      allowedStatuses.map((s) => (
                        <option key={s} value={String(s).toLowerCase()}>{formatLabelUpper(s)}</option>
                      ))
                    ) : (
                      <option value={report.status}>{formatLabelUpper(report.status)}</option>
                    )}
                  </select>
                )}
              </div>

              {!(String(report.status).toLowerCase() === 'resolved' || report.resolvedAt || String(report.status).toLowerCase() === 'rejected') && (
                <div>
                  <button onClick={handleUpdateStatus} disabled={updating} className={`w-full px-4 py-2 ${updating ? 'opacity-70 cursor-not-allowed' : ''} bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:from-orange-600 hover:to-orange-700 font-medium`}>
                    {updating ? 'Updating...' : 'Update Report'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {/* <div className="bg-white rounded-lg shadow p-6"> */}
            {/* <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (report.reporter?.id) {
                    const rid = String(report.reporter.id);
                    const url = `/admin/messages?open=${encodeURIComponent(rid)}`;
                    router.push(url);
                  } else {
                    window.alert('Reporter not available');
                  }
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Send Message
              </button> */}
              {/* <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Mark as Resolved
              </button> */}
            {/* </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}


