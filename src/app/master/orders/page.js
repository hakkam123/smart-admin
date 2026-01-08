'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiShoppingCart,
  FiSearch, 
  FiFilter,
  FiEye,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiDollarSign,
  FiCalendar,
  FiDownload,
  FiShoppingBag,
  FiUser,
  FiMapPin,
  FiPhone
} from 'react-icons/fi';

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shopFilter, setShopFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    const fetchOrders = async () => {
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

  // call admin endpoint which returns all orders (requires admin user or service secret)
  const res = await axios.get(`${API_BASE}/api/admin/orders`, { headers });
        // backend returns { orders }
        if (res.data && res.data.orders) {
          const serverOrders = res.data.orders.map(o => ({
            id: o.id,
            orderNumber: `#${o.id}`,
            customer: {
              name: o.user?.name || 'User',
              email: o.user?.email || '',
              phone: o.address?.phone || '',
              address: o.address ? `${o.address.street}, ${o.address.city}` : ''
            },
            shop: {
              id: o.storeId,
              name: o.store?.name || `Store ${o.storeId}`,
            },
            products: o.orderItems ? o.orderItems.map(it => ({
              id: it.product?.id || it.productId,
              name: it.product?.name || '',
              image: it.product?.images?.[0] || '',
              price: it.price,
              quantity: it.quantity,
            })) : [],
            status: o.status || 'pending',
            paymentStatus: o.isPaid ? 'paid' : 'pending',
            paymentMethod: o.paymentMethod,
            totalAmount: o.total,
            shippingFee: 0,
            discount: 0,
            finalAmount: o.total,
            orderDate: o.createdAt,
            estimatedDelivery: null,
            trackingNumber: null,
            shippingMethod: null,
            notes: null
          }));

          setOrders(serverOrders);
          setFilteredOrders(serverOrders);
          setLastUpdated(new Date());
        } else {
          console.warn('Unexpected orders response', res.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // fallback: keep empty or show message
      } finally {
        setLoading(false);
      }
    };

  fetchOrders();
  }, [getToken, isSignedIn]);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by shop
    if (shopFilter !== 'all') {
      filtered = filtered.filter(order => order.shop.id === shopFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, shopFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ORDER_PLACED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case  'DELIVERED':
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
        return <FiClock className="h-4 w-4" />;
      case 'PROCESSING':
        return <FiPackage className="h-4 w-4" />;
      case 'SHIPPED':
        return <FiTruck className="h-4 w-4" />;
      case 'DELIVERED':
        return <FiCheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <FiXCircle className="h-4 w-4" />;
      default:
        return <FiShoppingCart className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
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

  const getUniqueShops = () => {
    const shops = orders.map(order => order.shop);
    const uniqueShops = shops.filter((shop, index, self) =>
      index === self.findIndex(s => s.id === shop.id)
    );
    return uniqueShops;
  };

  const refreshData = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="rounded bg-gray-300 h-12 w-12"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Orders Monitoring</h1>
            <p className="text-sm text-gray-500">Real-time order tracking and management</p>
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-[12px] bg-slate-600 text-sm text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Refresh
            </button>
            <button className="inline-flex items-center px-4 py-2 text-[12px] bg-slate-600 text-sm text-white rounded-lg hover:bg-slate-700 transition-colors">
              Export
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
                placeholder="Search orders, customers, products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">ID: {order.id}</div>
                      {order.trackingNumber && (
                        <div className="text-xs text-blue-600 mt-1">
                          Tracking: {order.trackingNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <FiUser className="mr-1 h-4 w-4 text-gray-400" />
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FiPhone className="mr-1 h-3 w-3 text-gray-400" />
                          {order.customer.phone}
                        </div>
                        <div className="text-xs text-gray-500 flex items-start mt-1">
                          <FiMapPin className="mr-1 h-3 w-3 text-gray-400 mt-0.5 shrink-0" />
                          <span className="truncate max-w-xs">{order.customer.address}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {order.products.slice(0, 2).map((product, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                              <FiPackage className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty: {product.quantity} • {formatCurrency(product.price)}
                            </div>
                            {product.variant && (
                              <div className="text-xs text-gray-400">{product.variant}</div>
                            )}
                          </div>
                        </div>
                      ))}
                      {order.products.length > 2 && (
                        <div className="text-xs text-gray-500 mt-1">
                          +{order.products.length - 2} more items
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <FiShoppingBag className="mr-1 h-4 w-4 text-gray-400" />
                        {order.shop.name}
                      </div>
                      <div className="text-sm text-gray-500">Owner: {order.shop.owner}</div>
                      <div className="text-xs text-gray-500">{order.shop.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status.toLowerCase()}</span>
                      </span>
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          <FiDollarSign className="h-3 w-3 mr-1" />
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.finalAmount)}
                    </div>
                    <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                    {order.shippingFee > 0 && (
                      <div className="text-xs text-gray-400">
                        Shipping: {formatCurrency(order.shippingFee)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiCalendar className="mr-1 h-4 w-4 text-gray-400" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.orderDate).toLocaleTimeString()}
                    </div>
                    {order.estimatedDelivery && (
                      <div className="text-xs text-green-600 mt-1">
                        ETA: {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      href={`/master/orders/${order.id}`}
                      className="text-slate-600 hover:text-slate-900 p-2 rounded hover:bg-gray-100" 
                      title="View Order Details"
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
        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || shopFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No orders have been placed yet.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                  <span className="font-medium">{orders.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center bg-slate-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
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