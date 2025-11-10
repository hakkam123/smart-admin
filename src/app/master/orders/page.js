'use client';

import React, { useState, useEffect } from 'react';
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
  FiRefreshCw,
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

  useEffect(() => {
    // Mock orders data - replace with actual API call
    const mockOrdersData = [
      {
        id: 'ORD-2024-001',
        orderNumber: '#ORD001',
        customer: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+62 812-3456-7890',
          address: 'Jl. Sudirman No. 123, Jakarta Pusat'
        },
        shop: {
          id: 'SHP001',
          name: 'Tech Store Jakarta',
          owner: 'Ahmad Wijaya',
          phone: '+62 811-2233-4455'
        },
        products: [
          {
            id: 'PRD001',
            name: 'iPhone 15 Pro Max',
            image: '/images/products/iphone15.jpg',
            price: 18999000,
            quantity: 1,
            variant: '256GB Natural Titanium'
          },
          {
            id: 'PRD002',
            name: 'AirPods Pro 2',
            image: '/images/products/airpods.jpg',
            price: 3999000,
            quantity: 1,
            variant: 'White'
          }
        ],
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        totalAmount: 22998000,
        shippingFee: 15000,
        discount: 100000,
        finalAmount: 22913000,
        orderDate: '2024-11-02T09:30:00Z',
        estimatedDelivery: '2024-11-05T17:00:00Z',
        trackingNumber: 'JNE123456789',
        shippingMethod: 'JNE Regular',
        notes: 'Tolong kirim bubble wrap extra untuk iPhone'
      },
      {
        id: 'ORD-2024-002',
        orderNumber: '#ORD002',
        customer: {
          name: 'Jane Smith',
          email: 'jane.smith@company.com',
          phone: '+62 813-9876-5432',
          address: 'Jl. Braga No. 45, Bandung, Jawa Barat'
        },
        shop: {
          id: 'SHP002',
          name: 'Fashion Paradise',
          owner: 'Sari Indah',
          phone: '+62 812-5566-7788'
        },
        products: [
          {
            id: 'PRD003',
            name: 'Dress Casual Wanita',
            image: '/images/products/dress.jpg',
            price: 299000,
            quantity: 2,
            variant: 'Size M, Navy Blue'
          }
        ],
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'Bank Transfer',
        totalAmount: 598000,
        shippingFee: 12000,
        discount: 0,
        finalAmount: 610000,
        orderDate: '2024-11-01T14:15:00Z',
        estimatedDelivery: '2024-11-04T16:00:00Z',
        trackingNumber: 'SICEPAT987654321',
        shippingMethod: 'SiCepat Regular',
        notes: null
      },
      {
        id: 'ORD-2024-003',
        orderNumber: '#ORD003',
        customer: {
          name: 'Michael Chen',
          email: 'michael.chen@email.com',
          phone: '+62 816-9999-0000',
          address: 'Jl. Malioboro No. 89, Yogyakarta'
        },
        shop: {
          id: 'SHP003',
          name: 'Book Corner',
          owner: 'Dewi Sartika',
          phone: '+62 815-3344-5566'
        },
        products: [
          {
            id: 'PRD004',
            name: 'Clean Code Book',
            image: '/images/products/book-clean-code.jpg',
            price: 180000,
            quantity: 1,
            variant: 'Paperback English'
          },
          {
            id: 'PRD005',
            name: 'JavaScript Complete Guide',
            image: '/images/products/book-js.jpg',
            price: 250000,
            quantity: 1,
            variant: 'Paperback Indonesian'
          }
        ],
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'E-Wallet (OVO)',
        totalAmount: 430000,
        shippingFee: 10000,
        discount: 43000,
        finalAmount: 397000,
        orderDate: '2024-10-30T11:45:00Z',
        estimatedDelivery: '2024-11-02T15:00:00Z',
        trackingNumber: 'POS123987456',
        shippingMethod: 'Pos Indonesia',
        notes: null
      },
      {
        id: 'ORD-2024-004',
        orderNumber: '#ORD004',
        customer: {
          name: 'Sarah Wilson',
          email: 'sarah.wilson@tech.com',
          phone: '+62 815-7777-8888',
          address: 'Jl. Gajah Mada No. 67, Medan'
        },
        shop: {
          id: 'SHP001',
          name: 'Tech Store Jakarta',
          owner: 'Ahmad Wijaya',
          phone: '+62 811-2233-4455'
        },
        products: [
          {
            id: 'PRD006',
            name: 'Samsung Galaxy S24 Ultra',
            image: '/images/products/samsung-s24.jpg',
            price: 16999000,
            quantity: 1,
            variant: '512GB Titanium Black'
          }
        ],
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'Bank Transfer',
        totalAmount: 16999000,
        shippingFee: 25000,
        discount: 0,
        finalAmount: 17024000,
        orderDate: '2024-11-02T16:20:00Z',
        estimatedDelivery: '2024-11-06T17:00:00Z',
        trackingNumber: null,
        shippingMethod: 'JNE YES',
        notes: 'Pembayaran dalam proses verifikasi'
      },
      {
        id: 'ORD-2024-005',
        orderNumber: '#ORD005',
        customer: {
          name: 'Ahmad Rahman',
          email: 'ahmad.rahman@gmail.com',
          phone: '+62 814-5555-1234',
          address: 'Jl. Pemuda No. 78, Surabaya'
        },
        shop: {
          id: 'SHP004',
          name: 'Sports Equipment',
          owner: 'Budi Santoso',
          phone: '+62 817-6677-8899'
        },
        products: [
          {
            id: 'PRD007',
            name: 'Sepatu Running Nike',
            image: '/images/products/nike-shoes.jpg',
            price: 1299000,
            quantity: 1,
            variant: 'Size 42, Black White'
          }
        ],
        status: 'cancelled',
        paymentStatus: 'refunded',
        paymentMethod: 'Credit Card',
        totalAmount: 1299000,
        shippingFee: 15000,
        discount: 0,
        finalAmount: 1314000,
        orderDate: '2024-11-01T10:30:00Z',
        estimatedDelivery: null,
        trackingNumber: null,
        shippingMethod: 'JNE Regular',
        notes: 'Dibatalkan karena stok kosong'
      }
    ];

    // Simulate API call
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        setOrders(mockOrdersData);
        setFilteredOrders(mockOrdersData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="h-4 w-4" />;
      case 'processing':
        return <FiPackage className="h-4 w-4" />;
      case 'shipped':
        return <FiTruck className="h-4 w-4" />;
      case 'delivered':
        return <FiCheckCircle className="h-4 w-4" />;
      case 'cancelled':
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
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FiDownload className="mr-2 h-4 w-4" />
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
                        <span className="ml-1">{order.status}</span>
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