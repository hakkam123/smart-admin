'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
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
  FiFileText,
  FiExternalLink,
  FiTrash2
} from 'react-icons/fi';

export default function ShopsManagementPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [actionType, setActionType] = useState('');
  const [confirmationInput, setConfirmationInput] = useState(''); 

  const fetchShops = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      let endpoint;
      if (statusFilter === 'pending') {
        endpoint = `${apiUrl}/api/admin/approve-store`;
      } else if (statusFilter === 'approved' || statusFilter === 'declined') {
        endpoint = `${apiUrl}/api/admin/stores`;
      } else {
        endpoint = `${apiUrl}/api/admin/stores`;
      }         
        
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const transformedShops = response.data.stores.map(store => ({
        id: store.id,
        shopName: store.name,
        ownerName: store.user.name,
        email: store.email,
        phone: store.contact,
        address: store.address,
        shopDescription: store.description,
        status: store.status,
        submittedAt: store.createdAt,
        approvedAt: store.status === 'approved' ? store.updatedAt : null,
        shopLogo: store.logo,
        username: store.username,
        isActive: store.isActive,
        userId: store.userId
      }));

      setShops(transformedShops);
      setFilteredShops(transformedShops);
    } catch (error) {
      console.error('Error fetching shops:', error);
      // Remove alert, just set empty state
      setShops([]);
      setFilteredShops([]);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, getToken, statusFilter]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  useEffect(() => {
    let filtered = shops;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shop => shop.status === statusFilter);
    }

    // Filter by active status (only for approved shops)
    if (statusFilter === 'approved' && activeFilter !== 'all') {
      filtered = filtered.filter(shop => 
        activeFilter === 'active' ? shop.isActive : !shop.isActive
      );
    }

    setFilteredShops(filtered);
  }, [shops, searchTerm, statusFilter, activeFilter]);

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

  const confirmAction = async () => {
    if (!selectedShop) return;

    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const status = actionType === 'approve' ? 'approved' : 'rejected';
      
      await axios.post(`${apiUrl}/api/admin/approve-store`, {
        storeId: selectedShop.id,
        status: status
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Remove from pending list after successful action
      setShops(prevShops =>
        prevShops.filter(shop => shop.id !== selectedShop.id)
      );
      
      // Success - no alert needed
      
    } catch (error) {
      console.error('Error updating shop status:', error);
      // Could add toast notification here instead of alert
    }

    setShowApprovalModal(false);
    setSelectedShop(null);
    setActionType('');
    setConfirmationInput('');
  };

  const toggleStoreStatus = async (shop) => {
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      await axios.post(`${apiUrl}/api/admin/toggle-store`, {
        storeId: shop.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update shop status in local state
      setShops(prevShops =>
        prevShops.map(s =>
          s.id === shop.id
            ? { ...s, isActive: !s.isActive }
            : s
        )
      );
      
      // Success - no alert needed
      
    } catch (error) {
      console.error('Error toggling shop status:', error);
      // Could add toast notification here instead of alert
    }
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
      case 'approved':
        return (
          <div className="flex items-center space-x-3">
            <Link 
              href={`/master/shops/${shop.id}`}
              className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-gray-100" 
              title="View Shop Details"
            >
              <FiEye className="h-4 w-4" />
            </Link>
            
            {/* Toggle Switch */}
            <button
              onClick={() => toggleStoreStatus(shop)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                shop.isActive 
                  ? 'bg-green-500 focus:ring-green-500' 
                  : 'bg-gray-300 focus:ring-gray-500'
              }`}
              title={shop.isActive ? 'Deactivate Store' : 'Activate Store'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  shop.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
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

  if (!isLoaded || loading) {
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

  if (!isSignedIn) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900">Authentication Required</h2>
          <p className="mt-1 text-sm text-gray-500">
            Please sign in to access the stores management.
          </p>
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
              onClick={fetchShops}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between p-3 rounded-lg border bg-white gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 ml-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama toko..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border ml-3 border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setActiveFilter('all');
            }}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <FiFilter className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Shops Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SHOP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OWNER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SUBMITTED
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
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
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shop.status)}`}>
                        {getStatusIcon(shop.status)}
                        <span className="ml-1">{shop.status}</span>
                      </span>
                      {shop.status === 'approved' && (
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          shop.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            shop.isActive ? 'bg-green-400' : 'bg-gray-400'
                          }`}></span>
                          {shop.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </div>
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {statusFilter === 'pending' ? 'No pending applications' :
               statusFilter === 'approved' ? 'No approved shops' :
               statusFilter === 'declined' ? 'No declined applications' : 'No shops found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' :
               statusFilter === 'pending' ? 'No new shop applications are waiting for review.' :
               statusFilter === 'approved' ? 'No shops have been approved yet.' :
               statusFilter === 'declined' ? 'No applications have been declined.' :
               'No shop applications have been submitted yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Approval/Decline Modal */}
      {showApprovalModal && selectedShop && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto bg-white rounded-2xl shadow-xl max-w-md w-full">
            <button
              onClick={() => {
                setShowApprovalModal(false);
                setSelectedShop(null);
                setActionType('');
                setConfirmationInput('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>

            <div className="p-6 pt-8">
              <div className="text-center mb-6">
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                  actionType === 'approve' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {actionType === 'approve' ? (
                    <FiCheck className="h-8 w-8 text-green-600" />
                  ) : (
                    <FiX className="h-8 w-8 text-red-600" />
                  )}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {actionType === 'approve' ? 'Approve Shop Application' : 'Decline Shop Application'}
                </h3>
                
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to {actionType} <strong>{selectedShop.shopName}</strong> by{' '}
                  <strong>{selectedShop.ownerName}</strong>?
                </p>
              </div>

              {/* Warning Section */}
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      <strong>Warning:</strong> This action <strong>cannot be undone</strong>. 
                      {actionType === 'approve' 
                        ? ' The shop will be activated and owner can start selling.'
                        : ' Declining this application will remove all its associated data. Any test, configuration, monitoring insights, and more will be permanently lost.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Store Info Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {selectedShop.shopName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{selectedShop.shopName}</p>
                    <p className="text-xs text-gray-500">{selectedShop.ownerName} • {selectedShop.email}</p>
                  </div>
                  <div className="ml-auto">
                    <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                      <FiExternalLink className="h-3 w-3 mr-1" />
                      Go to Home
                    </button>
                  </div>
                </div>
              </div>

              {actionType === 'decline' && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    To decline, type the shop name <strong>{selectedShop.shopName}</strong> below
                  </p>
                  <div className="relative">
                    <FiTrash2 className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                    <input
                      type="text"
                      value={confirmationInput}
                      onChange={(e) => setConfirmationInput(e.target.value)}
                      placeholder={`Enter ${selectedShop.shopName}`}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedShop(null);
                    setActionType('');
                    setConfirmationInput('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  disabled={actionType === 'decline' && confirmationInput !== selectedShop?.shopName}
                  className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    actionType === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white' 
                      : actionType === 'decline' && confirmationInput !== selectedShop?.shopName
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
                  }`}
                >
                  {actionType === 'approve' ? 'Approve' : 'Yes, Decline Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
