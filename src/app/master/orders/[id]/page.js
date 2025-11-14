 'use client';

import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft, 
  FiShoppingCart,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiShoppingBag,
  FiInfo,
  FiCreditCard,
  FiFileText,
  FiAlertCircle,
  FiExternalLink
} from 'react-icons/fi';

export default function OrderDetailPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken, isSignedIn } = useAuth();
  const { id } = use(params);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

    const fetchOrder = async () => {
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

        const url = `${API_BASE}/api/admin/orders/${id}`;
        const res = await axios.get(url, { headers });

        let o = res.data;
        // Support APIs that return { order } or an order object directly
        if (o && o.order) o = o.order;

        if (!o) {
          setOrder(null);
          return;
        }

        const mapped = {
          id: o.id,
          orderNumber: o.id ? `#${o.id}` : o.orderNumber || '',
          customer: {
            name: o.user?.name || o.userName || 'User',
            email: o.user?.email || o.email || '',
            phone: o.address?.phone || '',
            address: o.address ? `${o.address.street || ''}${o.address.city ? ', ' + o.address.city : ''}` : (o.shippingAddress || ''),
            avatar: o.user?.image || ''
          },
          shop: {
            id: o.storeId || o.store?.id,
            name: o.store?.name || `Store ${o.storeId || ''}`,
            owner: o.store?.owner || '' ,
            phone: o.store?.contact || '',
            email: o.store?.email || '',
            address: o.store?.address || '',
            logo: o.store?.logo || ''
          },
          products: o.orderItems ? o.orderItems.map(it => ({
            id: it.product?.id || it.productId,
            name: it.product?.name || it.name || '',
            image: it.product?.images?.[0] || (it.product?.image) || '',
            price: it.price || it.unitPrice || 0,
            quantity: it.quantity || 1,
            variant: it.variant || '',
            sku: it.product?.sku || '' ,
            weight: it.product?.weight || ''
          })) : (o.products || []),
          status: o.status || 'pending',
          paymentStatus: o.isPaid || o.paymentStatus ? (o.isPaid ? 'paid' : o.paymentStatus) : 'pending',
          paymentMethod: o.paymentMethod || o.payment?.method || '',
          paymentDate: o.paymentDate || o.paidAt || null,
          totalAmount: o.total || o.totalAmount || 0,
          shippingFee: o.shippingFee || 0,
          discount: o.discount || 0,
          tax: o.tax || 0,
          finalAmount: o.finalAmount || o.total || 0,
          orderDate: o.createdAt || o.orderDate || null,
          estimatedDelivery: o.estimatedDelivery || null,
          deliveryMethod: o.deliveryMethod || null,
          shippingAddress: o.address ? `${o.address.street || ''} ${o.address.city || ''}` : (o.shippingAddress || ''),
          notes: o.notes || o.note || null,
          statusHistory: o.statusHistory || [],
          invoiceNumber: o.invoiceNumber || o.invoice || '' ,
          billingAddress: o.billingAddress || ''
        };

        setOrder(mapped);
      } catch (error) {
        console.error('Error fetching order:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, getToken, isSignedIn]);

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

  // Frontend canonical descriptions for statuses (render-only)
  const statusDescriptions = {
    ORDER_PLACED: 'Order placed by customer',
    PROCESSING: 'Order is being prepared by shop',
    SHIPPED: 'Order has been shipped',
    DELIVERED: 'Order delivered to customer',
    CANCELLED: 'Order was cancelled',
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid' :
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
          <p className="mt-1 text-sm text-gray-500">The order you&apos;re looking for doesn&apos;t exist.</p>
          <div className="mt-6">
            <Link
              href="/master/orders"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
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
              href="/master/orders"
              className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
              <p className="text-sm text-gray-500">Order ID: {order.id}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-2">{order.status}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="shrink-0">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
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
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      <p className="text-sm text-gray-500">Variant: {product.variant}</p>
                      <p className="text-xs text-gray-400">Weight: {product.weight}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Qty: {product.quantity}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.price * product.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  {order.customer.avatar ? (
                    <Image
                      src={order.customer.avatar}
                      alt={order.customer.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{order.customer.name}</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500 flex items-center">
                      <FiMail className="mr-2 h-4 w-4 text-gray-400" />
                      {order.customer.email}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FiPhone className="mr-2 h-4 w-4 text-gray-400" />
                      {order.customer.phone}
                    </p>
                    <p className="text-sm text-gray-500 flex items-start">
                      <FiMapPin className="mr-2 h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <span>{order.customer.address}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Shop Information</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  {order.shop.logo ? (
                    <Image
                      src={order.shop.logo}
                      alt={order.shop.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <FiShoppingBag className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{order.shop.name}</h4>
                  <p className="text-sm text-gray-500">Owner: {order.shop.owner}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500 flex items-center">
                      <FiMail className="mr-2 h-4 w-4 text-gray-400" />
                      {order.shop.email}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FiPhone className="mr-2 h-4 w-4 text-gray-400" />
                      {order.shop.phone}
                    </p>
                    <p className="text-sm text-gray-500 flex items-start">
                      <FiMapPin className="mr-2 h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <span>{order.shop.address}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status History */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Timeline</h3>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {order.statusHistory.map((item, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index !== order.statusHistory.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(item.status)}`}>
                              {getStatusIcon(item.status)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">{statusDescriptions[item.status] || item.description || ''}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime={item.createdAt}>
                                {(() => {
                                  const d = new Date(item.createdAt);
                                  if (isNaN(d)) return '';
                                  return d.toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
                                })()}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Order Notes</h3>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <FiInfo className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-900">{order.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
            </div>
            <div className="p-6">
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      <FiDollarSign className="h-3 w-3 mr-1" />
                      {order.paymentStatus}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="text-sm text-gray-900">{order.paymentMethod}</dd>
                </div>
                {order.paymentDate && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm font-medium text-gray-500">Payment Date</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(order.paymentDate).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Order Status Progress */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Progress</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Current Status */}
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Current Status</dt>
                  <dd>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
                    </span>
                  </dd>
                </div>

                {/* Progress Steps */}
                <div className="pt-3 border-t border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 mb-4">Progress Steps</dt>
                  <div className="space-y-3">
                    {/* Step 1: Order Placed */}
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        <FiCheckCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Order Placed</p>
                        <p className="text-xs text-gray-500">Order has been received</p>
                      </div>
                    </div>

                    {/* Step 2: Payment Confirmed */}
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        order.paymentStatus === 'paid' && ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)
                          ? 'bg-green-500 text-white' 
                          : order.paymentStatus === 'pending'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        {order.paymentStatus === 'paid' ? (
                          <FiCheckCircle className="h-5 w-5" />
                        ) : (
                          <FiClock className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Payment Confirmed</p>
                        <p className="text-xs text-gray-500">
                          {order.paymentStatus === 'paid' ? 'Payment received' : 'Waiting for payment'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Order PROCESSING */}
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)
                          ? order.status === 'PROCESSING' 
                            ? 'bg-blue-500 text-white animate-pulse'
                            : 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        {['SHIPPED', 'DELIVERED'].includes(order.status) ? (
                          <FiCheckCircle className="h-5 w-5" />
                        ) : order.status === 'PROCESSING' ? (
                          <FiPackage className="h-5 w-5" />
                        ) : (
                          <FiClock className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Order Processing</p>
                        <p className="text-xs text-gray-500">
                          {order.status === 'PROCESSING' 
                            ? 'Shop is preparing your order'
                            : ['SHIPPED', 'DELIVERED'].includes(order.status)
                            ? 'Order prepared successfully'
                            : 'Waiting for shop to process'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Order Shipped */}
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        ['SHIPPED', 'DELIVERED'].includes(order.status)
                          ? order.status === 'SHIPPED'
                            ? 'bg-purple-500 text-white animate-pulse'
                            : 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        {order.status === 'DELIVERED' ? (
                          <FiCheckCircle className="h-5 w-5" />
                        ) : order.status === 'SHIPPED' ? (
                          <FiTruck className="h-5 w-5" />
                        ) : (
                          <FiClock className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Order Shipped</p>
                        <p className="text-xs text-gray-500">
                          {order.status === 'SHIPPED' 
                            ? 'Order is on the way to customer'
                            : order.status === 'DELIVERED'
                            ? 'Order was shipped successfully'
                            : 'Waiting for shipment'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Step 5: Order Delivered */}
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        {order.status === 'DELIVERED' ? (
                          <FiCheckCircle className="h-5 w-5" />
                        ) : (
                          <FiClock className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Order Delivered</p>
                        <p className="text-xs text-gray-500">
                          {order.status === 'DELIVERED' 
                            ? 'Order completed successfully'
                            : 'Waiting for delivery confirmation'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="pt-3 border-t border-gray-200">
                  <dt className="text-sm font-medium text-gray-500 mb-2">Delivery Address</dt>
                  <dd className="text-sm text-gray-900">{order.shippingAddress}</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Price Details</h3>
            </div>
            <div className="p-6">
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">Subtotal</dt>
                  <dd className="text-sm text-gray-900">{formatCurrency(order.totalAmount)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">Shipping Fee</dt>
                  <dd className="text-sm text-gray-900">{formatCurrency(order.shippingFee)}</dd>
                </div>
                {order.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-500">Discount</dt>
                    <dd className="text-sm text-red-600">-{formatCurrency(order.discount)}</dd>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-500">Tax</dt>
                    <dd className="text-sm text-gray-900">{formatCurrency(order.tax)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">{formatCurrency(order.finalAmount)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Invoice Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Invoice</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Invoice Number</span>
                  <span className="text-sm text-gray-900 font-mono">{order.invoiceNumber}</span>
                </div>
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <FiFileText className="mr-2 h-4 w-4" />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 flex items-center">
                  <FiUser className="mr-2 h-4 w-4" />
                  Contact Customer
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 flex items-center">
                  <FiShoppingBag className="mr-2 h-4 w-4" />
                  Contact Shop
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center">
                  <FiCalendar className="mr-2 h-4 w-4" />
                  View Order History
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-green-700 bg-green-50 rounded-md hover:bg-green-100 flex items-center">
                  <FiFileText className="mr-2 h-4 w-4" />
                  Print Order Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}