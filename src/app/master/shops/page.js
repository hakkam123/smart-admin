'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiShoppingBag,
  FiSearch, 
  FiFilter,
  FiEye,
  FiCheck,
  FiX,
  FiClock,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUserCheck,
  FiUserX,
  FiMapPin,
  FiRefreshCw,
  FiUser,
  FiImage,
  FiFileText
} from 'react-icons/fi';

export default function ShopsManagementPage() {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' or 'decline'

  useEffect(() => {
    // Mock shops data - replace with actual API call
    const mockShops = [
      {
        id: '1',
        shopName: 'Jane Fashion Store',
        ownerName: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+62 813-9876-5432',
        address: 'Jl. Braga No. 15, Bandung, Jawa Barat',
        shopDescription: 'Toko fashion wanita dengan koleksi trendy dan berkualitas',
        category: 'Fashion & Beauty',
        status: 'pending',
        submittedAt: '2024-01-20T14:30:00Z',
        documents: ['KTP', 'NPWP', 'SIUP', 'Shop Photos'],
        shopLogo: '/images/shops/jane-fashion.jpg',
        businessType: 'Fashion Retail',
        expectedRevenue: 'Rp 50,000,000 - Rp 100,000,000',
        employeeCount: '5-10 orang'
      },
      {
        id: '2',
        shopName: 'Tech Solutions Store',
        ownerName: 'Ahmad Rahman',
        email: 'ahmad.tech@email.com',
        phone: '+62 814-5555-1234',
        address: 'Jl. Pemuda No. 88, Surabaya, Jawa Timur',
        shopDescription: 'Penjualan aksesori dan gadget teknologi terkini',
        category: 'Electronics & Technology',
        status: 'approved',
        submittedAt: '2024-01-18T11:20:00Z',
        approvedAt: '2024-01-19T09:15:00Z',
        documents: ['KTP', 'NPWP', 'TDP', 'Shop Photos'],
        shopLogo: '/images/shops/tech-solutions.jpg',
        businessType: 'Electronics Retail',
        expectedRevenue: 'Rp 100,000,000 - Rp 500,000,000',
        employeeCount: '10-25 orang'
      },
      {
        id: '3',
        shopName: 'Healthy Food Corner',
        ownerName: 'Sarah Wilson',
        email: 'sarah.food@email.com',
        phone: '+62 815-7777-8888',
        address: 'Jl. Sudirman No. 45, Jakarta Selatan',
        shopDescription: 'Menyediakan makanan sehat dan organic untuk gaya hidup sehat',
        category: 'Food & Beverage',
        status: 'declined',
        submittedAt: '2024-01-17T16:45:00Z',
        declinedAt: '2024-01-18T10:30:00Z',
        declineReason: 'Dokumen tidak lengkap dan alamat tidak sesuai',
        documents: ['KTP', 'Shop Photos'],
        shopLogo: '/images/shops/healthy-food.jpg',
        businessType: 'Food & Beverage',
        expectedRevenue: 'Rp 25,000,000 - Rp 50,000,000',
        employeeCount: '1-5 orang'
      },
      {
        id: '4',
        shopName: 'Book & Coffee Hub',
        ownerName: 'Michael Chen',
        email: 'michael.books@email.com',
        phone: '+62 816-9999-0000',
        address: 'Jl. Malioboro No. 123, Yogyakarta',
        shopDescription: 'Kombinasi toko buku dan coffee shop untuk para book lover',
        category: 'Books & Entertainment',
        status: 'pending',
        submittedAt: '2024-01-21T09:15:00Z',
        documents: ['KTP', 'NPWP', 'Shop Photos', 'Business Plan'],
        shopLogo: '/images/shops/book-coffee.jpg',
        businessType: 'Books & Cafe',
        expectedRevenue: 'Rp 30,000,000 - Rp 75,000,000',
        employeeCount: '5-10 orang'
      },
      {
        id: '5',
        shopName: 'Sports Equipment Pro',
        ownerName: 'David Kumar',
        email: 'david.sports@email.com',
        phone: '+62 817-1111-2222',
        address: 'Jl. Asia Afrika No. 67, Bandung, Jawa Barat',
        shopDescription: 'Penjualan peralatan olahraga lengkap untuk semua jenis sport',
        category: 'Sports & Recreation',
        status: 'approved',
        submittedAt: '2024-01-15T13:20:00Z',
        approvedAt: '2024-01-16T11:45:00Z',
        documents: ['KTP', 'NPWP', 'SIUP', 'TDP', 'Shop Photos'],
        shopLogo: '/images/shops/sports-pro.jpg',
        businessType: 'Sports Equipment',
        expectedRevenue: 'Rp 75,000,000 - Rp 200,000,000',
        employeeCount: '15-30 orang'
      }
    ];

    // Simulate API call
    const fetchShops = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShops(mockShops);
        setFilteredShops(mockShops);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    let filtered = shops;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shop => shop.status === statusFilter);
    }

    setFilteredShops(filtered);
  }, [shops, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FiUserCheck className="h-4 w-4" />;
      case 'pending':
        return <FiClock className="h-4 w-4" />;
      case 'declined':
        return <FiUserX className="h-4 w-4" />;
      default:
        return <FiShoppingBag className="h-4 w-4" />;
    }
  };

  const handleApprove = (shop) => {
    setSelectedShop(shop);
    setActionType('approve');
    setShowApprovalModal(true);
  };

  const handleDecline = (shop) => {
    setSelectedShop(shop);
    setActionType('decline');
    setShowApprovalModal(true);
  };

  const confirmAction = () => {
    if (!selectedShop) return;

    const newStatus = actionType === 'approve' ? 'approved' : 'declined';
    const now = new Date().toISOString();
    
    setShops(prevShops =>
      prevShops.map(shop =>
        shop.id === selectedShop.id
          ? { 
              ...shop, 
              status: newStatus,
              ...(actionType === 'approve' 
                ? { approvedAt: now }
                : { declinedAt: now, declineReason: 'Reviewed by admin' }
              )
            }
          : shop
      )
    );

    setShowApprovalModal(false);
    setSelectedShop(null);
    setActionType('');

    // Show success message
    const message = actionType === 'approve' 
      ? `Shop "${selectedShop.shopName}" has been approved successfully!`
      : `Shop "${selectedShop.shopName}" has been declined.`;
    
    alert(message);
  };

  const getActionButtons = (shop) => {
    switch (shop.status) {
      case 'pending':
        return (
          <div className="flex items-center space-x-2">
            <Link 
              href={`/master/shops/${shop.id}`}
              className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-gray-100" 
              title="View Shop Details"
            >
              <FiEye className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleApprove(shop)}
              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
              title="Approve Shop"
            >
              <FiCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDecline(shop)}
              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
              title="Decline Shop"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        );
      default:
        return (
          <Link 
            href={`/master/shops/${shop.id}`}
            className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-gray-100" 
            title="View Shop Details"
          >
            <FiEye className="h-4 w-4" />
          </Link>
        );
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
                    <div className="rounded-lg bg-gray-300 h-16 w-16"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Shops Management</h1>
            <p className="text-sm text-gray-500">Manage shop applications and approvals</p>
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

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search shops..."
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
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-500">
                Showing {filteredShops.length} of {shops.length} shops
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shops Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-12 w-12">
                        {shop.shopLogo ? (
                          <Image
                            src={shop.shopLogo}
                            alt={shop.shopName}
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
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{shop.shopName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiMapPin className="mr-1 h-4 w-4" />
                          {shop.address.length > 30 ? `${shop.address.substring(0, 30)}...` : shop.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{shop.ownerName}</div>
                        <div className="text-sm text-gray-500">{shop.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {shop.category}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{shop.businessType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shop.status)}`}>
                      {getStatusIcon(shop.status)}
                      <span className="ml-1">{shop.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1 h-4 w-4 text-gray-400" />
                      {new Date(shop.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {getActionButtons(shop)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredShops.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shops found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No shop applications have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Approval/Decline Modal */}
      {showApprovalModal && selectedShop && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                actionType === 'approve' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {actionType === 'approve' ? (
                  <FiCheck className="h-6 w-6 text-green-600" />
                ) : (
                  <FiX className="h-6 w-6 text-red-600" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">
                {actionType === 'approve' ? 'Approve Shop Application' : 'Decline Shop Application'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to {actionType} <strong>{selectedShop.shopName}</strong> by <strong>{selectedShop.ownerName}</strong>?
                  {actionType === 'approve' 
                    ? ' The shop will be activated and owner can start selling.'
                    : ' The shop application will be rejected.'
                  }
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 text-white text-base font-medium rounded-md w-24 mr-3 ${
                    actionType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionType === 'approve' ? 'Approve' : 'Decline'}
                </button>
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedShop(null);
                    setActionType('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-24 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
