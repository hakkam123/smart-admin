'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft,
  FiEdit,
  FiSave,
  FiUpload,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCamera,
  FiDownload,
  FiPrinter,
  FiMessageSquare,
  FiXCircle,
  FiShoppingCart
} from 'react-icons/fi';

const ALL_STATUSES = ['ORDER_PLACED', 'PROCESSING', 'DELIVERED','SHIPPED' , 'CANCELLED'];
const STATUS_LABELS = {
  ORDER_PLACED: 'Order Placed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [zoomSrc, setZoomSrc] = useState(null);

  const { getToken } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch order detail from admin API
  const fetchOrder = useCallback(async () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
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

      const url = `${API_BASE}/api/store/orders/${params.id}`;
      const res = await axios.get(url, { headers, withCredentials: true });
      let o = res.data;
      if (o && o.order) o = o.order;
      if (!o) {
        setOrderData(null);
        return;
      }

      const mapped = {
        id: o.id,
        invoice: o.invoice || (o.id ? `#${o.id}` : ''),
        customerName: o.user?.name || o.userName || 'User',
        total: o.total || o.totalAmount || o.finalAmount || 0,
        status: o.status || 'pending',
        orderDate: o.createdAt || o.orderDate || null,
        address: o.address ? `${o.address.street || ''} ${o.address.city || ''}` : (o.shippingAddress || ''),
        phone: o.address?.phone || o.user?.phone || '',
        email: o.user?.email || o.email || '',
        paymentMethod: o.paymentMethod || o.payment?.method || '',
        paymentReceipt: o.paymentReceipt || [],
        shippingMethod: o.deliveryMethod || '',
        notes: o.notes || '',
        items: o.orderItems ? o.orderItems.map(it => ({
          id: it.id || it.productId,
          name: it.product?.name || it.name || '',
          price: it.price || it.unitPrice || 0,
          quantity: it.quantity || 1,
          image: it.product?.images?.[0] || it.product?.image || ''
        })) : (o.products || []),
        statusHistory: o.statusHistory || [],
        carrier: o.carrier || o.store || null,
        userId: o.user?.id || o.userId || null,
        userAvatar: o.user?.avatar || o.user?.image || null
      };

      setOrderData(mapped);
      // don't pre-select the current status to avoid duplicate actions
      setStatusUpdate('');
      // populate quick-messages with buyer info so Send Message navigates to chat
      try {
        const buyerEntry = mapped.userId ? {
          id: String(mapped.userId),
          sender: mapped.customerName,
          message: mapped.notes || '',
          timestamp: mapped.orderDate || new Date().toISOString(),
          isOnline: false,
          avatar: mapped.userAvatar || '/api/placeholder/40/40'
        } : null;
        if (buyerEntry) setMessages([buyerEntry]);
      } catch (e) { /* ignore */ }
    } catch (error) {
      console.error('Error fetching order detail:', error?.response || error);
      setOrderData(null);
    }
  }, [params.id, getToken]);

  useEffect(() => {
    if (params.id) fetchOrder();
  }, [params.id, fetchOrder]);

  const [messages, setMessages] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ORDER_PLACED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
      switch (status) {
        case 'ORDER_PLACED':
          return <FiClock className="h-5 w-5" />;
        case 'PROCESSING':
          return <FiPackage className="h-5 w-5" />;
        case 'SHIPPED':
          return <FiTruck className="h-5 w-5" />;
        case 'DELIVERED':
          return <FiCheckCircle className="h-5 w-5" />;
        case 'CANCELLED':
          return <FiXCircle className="h-5 w-5" />;
        default:
          return <FiShoppingCart className="h-5 w-5" />;
      }
    };

  const statusDescriptions = {
    ORDER_PLACED: 'Order placed by customer',
    PROCESSING: 'Order is being prepared by shop',
    SHIPPED: 'Order has been shipped',
    DELIVERED: 'Order delivered to customer',
    CANCELLED: 'Order was cancelled'
  };

  const availableStatuses = useMemo(() => {
    const used = new Set((orderData?.statusHistory || []).map(s => s.status).filter(Boolean));
    // show statuses that haven't occurred yet (exclude any used statuses)
    // also exclude the current status to avoid duplicate action
    const current = orderData?.status;
    return ALL_STATUSES.filter(s => !used.has(s) && s !== current);
  }, [orderData?.statusHistory, orderData?.status]);

  // Ensure the select has a valid value when available statuses change
  useEffect(() => {
    if (!availableStatuses || availableStatuses.length === 0) {
      setStatusUpdate('');
      return;
    }
    setStatusUpdate(prev => (availableStatuses.includes(prev) ? prev : availableStatuses[0]));
  }, [availableStatuses]);

  const handleStatusUpdate = () => {
    (async () => {
      if (!params.id) return;
      setIsUpdating(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
      const url = `${API_BASE}/api/store/orders/${params.id}`;
      try {
        const formData = new FormData();
        formData.append('status', statusUpdate);
        formData.append('description', notes || '');
        if (uploadedFile) {
          formData.append('attachments', uploadedFile, uploadedFile.name || `attachment-${Date.now()}`);
        }

        const headers = {};
        if (getToken) {
          try {
            const token = await getToken();
            if (token) headers.Authorization = `Bearer ${token}`;
          } catch (err) {
            console.warn('Failed to get Clerk token', err);
          }
        }

        await axios.post(url, formData, { headers, withCredentials: true });
        // refresh order detail to pick up updated status and timeline
        await fetchOrder();
        // clear uploaded file + preview and reset input
        if (uploadedPreview) {
          try { URL.revokeObjectURL(uploadedPreview); } catch (e) {}
        }
        setUploadedPreview(null);
        setUploadedFile(null);
        setNotes('');
        try { if (fileInputRef?.current) fileInputRef.current.value = ''; } catch (e) {}
      } catch (error) {
        console.error('Failed updating status via store endpoint:', error?.response || error);
      } finally {
        setIsUpdating(false);
      }
    })();
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      try {
        const preview = URL.createObjectURL(file);
        setUploadedPreview(preview);
      } catch (e) {
        setUploadedPreview(null);
      }
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    };
  };

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/admin" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/admin/orders" className="hover:text-gray-700">Order</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">Show Order</span>
        </div>
      </nav>

      <div className="flex h-full">
        {/* Sidebar - Quick Messages */}
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiArrowLeft size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">Quick Messages</h3>
          </div>

          <div className="space-y-4">
            {messages.length ? messages.map((message) => (
              <div key={message.id} className="flex items-center space-x-3">
                <div className="relative">
                  {message.avatar ? (
                    <Image src={message.avatar} alt={message.sender} width={40} height={40} className="rounded-full object-cover" unoptimized />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {message.sender.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{message.sender}</h4>
                </div>
              </div>
            )) : (
              <div className="text-sm text-gray-500">No quick contacts</div>
            )}
          </div>

          <button
            onClick={() => {
              const targetId = orderData?.userId || orderData?.id;
              if (targetId) router.push(`/admin/messages?open=${encodeURIComponent(targetId)}`);
            }}
            className="w-full mt-6 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <FiMessageSquare className="mr-2" size={16} />
            Send Message
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Information */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Information</h2>
              
              {/* Order Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Invoice</label>
                  <p className="text-gray-900 font-medium">{orderData.invoice}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
                  <p className="text-gray-900 font-medium">{orderData.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total</label>
                  <p className="text-gray-900 font-medium">{orderData.total.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(orderData.status)}`}>
                    {orderData.status === 'delivered' ? 'Delivery' : orderData.status}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Address</h3>
                <p className="text-gray-700 leading-relaxed">{orderData.address}</p>
              </div>

              {/* Item List */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Item List</h3>
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600 font-medium">{index + 1}.</span>
                         <div className="shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded-lg object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                <FiPackage className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-medium text-gray-500">{item.price.toLocaleString('id-ID')}</p>
                        <p className="font-medium text-gray-900"> {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-700 leading-relaxed">{orderData.notes}</p>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                <p className="text-gray-700 leading-relaxed">{orderData.paymentMethod}</p>
                {orderData.paymentReceipt && orderData.paymentReceipt.length > 0 && (
                  <div className="mt-4">  
                    <div className="flex items-center space-x-3">
                      {orderData.paymentReceipt.map((r, idx) => (
                        <button
                          key={idx}
                          onClick={() => setZoomSrc(r)}
                          className="focus:outline-none"
                          aria-label={`Open payment receipt ${idx + 1}`}
                        >
                          <Image src={r} alt={`receipt-${idx}`} width={180} height={120} className="rounded-md object-cover" unoptimized />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Update Status Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {availableStatuses.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <FiUpload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Kirim Bukti</p>
                      </label>
                    </div>
                    {uploadedPreview && (
                      <div className="mt-2">
                        <Image src={uploadedPreview} alt="Uploaded proof" width={100} height={100} className="rounded-lg" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Add notes..."
                    />
                  </div>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || !statusUpdate}
                  className={`mt-4 px-6 py-2 ${isUpdating || !statusUpdate ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-lg transition-colors`}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>

            {/* Order Status Timeline (master-style) */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Order Timeline</h3>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {orderData.statusHistory.map((item, index) => {
                      const ts = item.createdAt || '';
                      const isLast = index === orderData.statusHistory.length - 1;
                      return (
                        <li key={index}>
                          <div className="relative pb-8">
                            {!isLast ? <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" /> : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(item.status || item.state)}`}>
                                  {getStatusIcon(item.status || item.state)}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">{statusDescriptions[item.status] || ''}</p>
                                  {item.attachments && item.attachments.length > 0 && (
                                    <div className="mt-2">
                                      <a href={item.attachments[0]} target="_blank" rel="noreferrer">
                                        <Image src={item.attachments[0]} alt="attachment" width={180} height={120} className="rounded-md object-cover" />
                                      </a>
                                    </div>
                                  )}
                                   <p className="text-sm text-gray-500 mt-2">{item.description || ''}</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <time dateTime={ts}>
                                    {(() => {
                                      const d = new Date(ts);
                                      if (isNaN(d)) return '';
                                      return d.toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
                                    })()}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          {zoomSrc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" role="dialog" aria-modal="true">
              <button onClick={() => setZoomSrc(null)} className="absolute top-6 right-6 text-white p-2 rounded-full bg-black bg-opacity-30" aria-label="Close image">
                <FiXCircle size={28} />
              </button>
              <div className="max-w-4xl max-h-[80vh] overflow-auto p-4">
                <Image src={zoomSrc} alt="zoomed receipt" width={1200} height={800} className="max-w-full max-h-[80vh] rounded-md" unoptimized />
              </div>
            </div>
          )}
        </div>
      );
    }
