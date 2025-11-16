'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiTrash2,
  FiMoreVertical,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample orders data
  const orderStats = [
    {
      title: 'Total Orders',
      value: '2,350',
      icon: FiShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Orders',
      value: '45',
      icon: FiClock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Completed Orders',
      value: '2,156',
      icon: FiCheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Revenue',
      value: 'Rp 45,231,890',
      icon: FiDollarSign,
      color: 'bg-purple-500'
    }
  ];

  const ordersData = [
    {
      id: 1,
      invoice: 'INV-123',
      quantity: 1,
      totalPrice: 100000,
      buyerName: 'Edward Timber',
      date: '28/09/2025',
      status: 'completed',
      items: [
        {
          name: 'Wireless Headphones',
          sku: 'WH-001',
          price: 100000,
          quantity: 1
        }
      ],
      shippingAddress: 'Jl. Kol. Ahmad Syam No.45 E, Bogor',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      invoice: 'INV-124',
      quantity: 2,
      totalPrice: 1500000,
      buyerName: 'Sarah Wilson',
      date: '27/09/2025',
      status: 'pending',
      items: [
        {
          name: 'Smart Watch',
          sku: 'SW-002',
          price: 750000,
          quantity: 2
        }
      ],
      shippingAddress: 'Jl. Sudirman No.123, Jakarta',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 3,
      invoice: 'INV-125',
      quantity: 1,
      totalPrice: 2500000,
      buyerName: 'John Smith',
      date: '26/09/2025',
      status: 'shipped',
      items: [
        {
          name: 'Gaming Laptop',
          sku: 'GL-003',
          price: 2500000,
          quantity: 1
        }
      ],
      shippingAddress: 'Jl. Gatot Subroto No.456, Bandung',
      paymentMethod: 'E-Wallet'
    },
    {
      id: 4,
      invoice: 'INV-126',
      quantity: 3,
      totalPrice: 450000,
      buyerName: 'Maria Garcia',
      date: '25/09/2025',
      status: 'processing',
      items: [
        {
          name: 'Phone Case',
          sku: 'PC-004',
          price: 150000,
          quantity: 3
        }
      ],
      shippingAddress: 'Jl. Thamrin No.789, Jakarta',
      paymentMethod: 'Credit Card'
    },
    {
      id: 5,
      invoice: 'INV-127',
      quantity: 1,
      totalPrice: 800000,
      buyerName: 'David Brown',
      date: '24/09/2025',
      status: 'cancelled',
      items: [
        {
          name: 'Bluetooth Speaker',
          sku: 'BS-005',
          price: 800000,
          quantity: 1
        }
      ],
      shippingAddress: 'Jl. Kebon Jeruk No.321, Jakarta',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 6,
      invoice: 'INV-128',
      quantity: 2,
      totalPrice: 3000000,
      buyerName: 'Emma Johnson',
      date: '23/09/2025',
      status: 'completed',
      items: [
        {
          name: 'Tablet Pro',
          sku: 'TP-006',
          price: 1500000,
          quantity: 2
        }
      ],
      shippingAddress: 'Jl. Merdeka No.654, Surabaya',
      paymentMethod: 'Credit Card'
    },
    {
      id: 7,
      invoice: 'INV-129',
      quantity: 1,
      totalPrice: 650000,
      buyerName: 'Michael Chen',
      date: '22/09/2025',
      status: 'pending',
      items: [
        {
          name: 'Wireless Mouse',
          sku: 'WM-007',
          price: 650000,
          quantity: 1
        }
      ],
      shippingAddress: 'Jl. Diponegoro No.987, Yogyakarta',
      paymentMethod: 'E-Wallet'
    },
    {
      id: 8,
      invoice: 'INV-130',
      quantity: 4,
      totalPrice: 2000000,
      buyerName: 'Lisa Anderson',
      date: '21/09/2025',
      status: 'shipped',
      items: [
        {
          name: 'Power Bank',
          sku: 'PB-008',
          price: 500000,
          quantity: 4
        }
      ],
      shippingAddress: 'Jl. Ahmad Yani No.147, Medan',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 9,
      invoice: 'INV-131',
      quantity: 1,
      totalPrice: 1200000,
      buyerName: 'Robert Taylor',
      date: '20/09/2025',
      status: 'processing',
      items: [
        {
          name: 'Smart TV Box',
          sku: 'STB-009',
          price: 1200000,
          quantity: 1
        }
      ],
      shippingAddress: 'Jl. Pahlawan No.258, Semarang',
      paymentMethod: 'Credit Card'
    },
    {
      id: 10,
      invoice: 'INV-132',
      quantity: 2,
      totalPrice: 900000,
      buyerName: 'Jennifer White',
      date: '19/09/2025',
      status: 'completed',
      items: [
        {
          name: 'USB Cable',
          sku: 'UC-010',
          price: 450000,
          quantity: 2
        }
      ],
      shippingAddress: 'Jl. Veteran No.369, Malang',
      paymentMethod: 'E-Wallet'
    }
  ];

  // Filter orders based on status and search term
  const filteredOrders = ordersData.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = 
      order.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change} {stat.period}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg">
        {/* Header with filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Order</h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-40 px-3 py-2 text-sm border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search Order"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 text-sm border text-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + index + 1}.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.invoice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.buyerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      Status
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <FiTrash2 size={16} />
                      </button>
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <FiEye size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No results message */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button 
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredOrders.length)}</span> of{' '}
                  <span className="font-medium">{filteredOrders.length}</span> results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNumber
                            ? 'bg-orange-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                        ...
                      </span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
