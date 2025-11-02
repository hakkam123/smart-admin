'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft, 
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiFileText,
  FiCheck,
  FiX,
  FiClock,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiBriefcase,
  FiInfo,
  FiAlertCircle
} from 'react-icons/fi';

export default function UserDetailPage({ params }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'decline'

  useEffect(() => {
    // Mock users data - replace with actual API call
    const mockUsersData = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+62 812-3456-7890',
        avatar: '/images/users/john.jpg',
        status: 'pending',
        role: 'customer',
        registeredAt: '2024-01-15T10:30:00Z',
        lastLogin: null,
        address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        verificationDocuments: [
          { type: 'KTP', number: '3171051505900001', verified: true },
          { type: 'SIM', number: 'D.12345.678', verified: false }
        ],
        businessType: null,
        companyName: null,
        bankAccount: {
          bankName: 'Bank Central Asia',
          accountNumber: '1234567890',
          accountName: 'John Doe'
        },
        preferences: {
          newsletter: true,
          smsNotifications: false,
          emailNotifications: true
        },
        notes: 'Customer interested in electronics products.',
        registrationSource: 'Website',
        referralCode: null
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        phone: '+62 813-9876-5432',
        avatar: '/images/users/jane.jpg',
        status: 'approved',
        role: 'vendor',
        registeredAt: '2024-01-10T14:20:00Z',
        lastLogin: '2024-01-20T09:15:00Z',
        address: 'Jl. Braga No. 45, Bandung, Jawa Barat 40111',
        dateOfBirth: '1985-08-22',
        gender: 'Female',
        verificationDocuments: [
          { type: 'KTP', number: '3273046208850002', verified: true },
          { type: 'NPWP', number: '12.345.678.9-012.000', verified: true },
          { type: 'SIUP', number: '510/1.824.659', verified: true }
        ],
        businessType: 'Fashion Retail',
        companyName: 'Jane Fashion Store',
        bankAccount: {
          bankName: 'Bank Mandiri',
          accountNumber: '9876543210',
          accountName: 'PT Jane Fashion Store'
        },
        preferences: {
          newsletter: true,
          smsNotifications: true,
          emailNotifications: true
        },
        notes: 'Established fashion vendor with good track record.',
        registrationSource: 'B2B Portal',
        referralCode: 'VENDOR2024'
      },
      {
        id: '3',
        name: 'Ahmad Rahman',
        email: 'ahmad.rahman@gmail.com',
        phone: '+62 814-5555-1234',
        avatar: '/images/users/ahmad.jpg',
        status: 'declined',
        role: 'customer',
        registeredAt: '2024-01-12T16:45:00Z',
        lastLogin: null,
        address: 'Jl. Pemuda No. 78, Surabaya, Jawa Timur 60271',
        dateOfBirth: '1992-12-03',
        gender: 'Male',
        verificationDocuments: [
          { type: 'KTP', number: '3578031212920003', verified: false }
        ],
        businessType: null,
        companyName: null,
        bankAccount: null,
        preferences: {
          newsletter: false,
          smsNotifications: true,
          emailNotifications: false
        },
        notes: 'Account declined due to incomplete verification documents.',
        registrationSource: 'Mobile App',
        referralCode: null
      }
    ];

    // Simulate API call
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const foundUser = mockUsersData.find(u => u.id === params.id);
        setUser(foundUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

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
        return <FiUserCheck className="h-5 w-5" />;
      case 'pending':
        return <FiClock className="h-5 w-5" />;
      case 'declined':
        return <FiUserX className="h-5 w-5" />;
      default:
        return <FiUsers className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'vendor':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = () => {
    setActionType('approve');
    setShowApprovalModal(true);
  };

  const handleDecline = () => {
    setActionType('decline');
    setShowApprovalModal(true);
  };

  const confirmAction = () => {
    if (!user) return;

    const newStatus = actionType === 'approve' ? 'approved' : 'declined';
    
    setUser(prevUser => ({
      ...prevUser,
      status: newStatus
    }));

    setShowApprovalModal(false);
    setActionType('');

    // Show success message
    const message = actionType === 'approve' 
      ? `User ${user.name} has been approved successfully!`
      : `User ${user.name} has been declined.`;
    
    alert(message);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">User not found</h3>
          <p className="mt-1 text-sm text-gray-500">The user you&apos;re looking for doesn&apos;t exist.</p>
          <div className="mt-6">
            <Link
              href="/master/users"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
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
              href="/master/users"
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">User Account Details</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          {user.status === 'pending' && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleApprove}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <FiCheck className="mr-2 h-4 w-4" />
                Approve
              </button>
              <button
                onClick={handleDecline}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <FiX className="mr-2 h-4 w-4" />
                Decline
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FiMail className="mr-1 h-4 w-4 text-gray-400" />
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FiPhone className="mr-1 h-4 w-4 text-gray-400" />
                    {user.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FiCalendar className="mr-1 h-4 w-4 text-gray-400" />
                    {new Date(user.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <p className="mt-1 text-sm text-gray-900">{user.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-start">
                    <FiMapPin className="mr-1 h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    {user.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information (for vendors) */}
          {user.role === 'vendor' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <FiBriefcase className="mr-1 h-4 w-4 text-gray-400" />
                      {user.companyName || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Business Type</label>
                    <p className="mt-1 text-sm text-gray-900">{user.businessType || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Documents */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Verification Documents</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {user.verificationDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FiFileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                        <p className="text-sm text-gray-500">{doc.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {doc.verified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheck className="mr-1 h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FiClock className="mr-1 h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bank Account (if available) */}
          {user.bankAccount && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Bank Account Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Bank Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user.bankAccount.bankName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Account Number</label>
                    <p className="mt-1 text-sm text-gray-900">{user.bankAccount.accountNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Account Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user.bankAccount.accountName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {user.notes && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Admin Notes</h3>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <FiInfo className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-900">{user.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Avatar & Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile</h3>
            </div>
            <div className="p-6 text-center">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={120}
                  height={120}
                  className="mx-auto h-30 w-30 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="mx-auto h-30 w-30 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <h4 className="mt-4 text-lg font-medium text-gray-900">{user.name}</h4>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                  {getStatusIcon(user.status)}
                  <span className="ml-2">{user.status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Account Info</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Registered</span>
                  <span className="text-sm text-gray-900">
                    {new Date(user.registeredAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Last Login</span>
                  <span className="text-sm text-gray-900">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Source</span>
                  <span className="text-sm text-gray-900">{user.registrationSource}</span>
                </div>
                {user.referralCode && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Referral</span>
                    <span className="text-sm text-gray-900">{user.referralCode}</span>
                  </div>
                )}
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
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
                  Send Email to User
                </button>                
                <button className="block w-full text-left px-4 py-2 text-sm text-red-700 bg-red-50 rounded-md hover:bg-red-100">
                  Suspend Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval/Decline Modal */}
      {showApprovalModal && (
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
                {actionType === 'approve' ? 'Approve User' : 'Decline User'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to {actionType} <strong>{user.name}</strong>&apos;s account?
                  {actionType === 'approve' 
                    ? ' They will be able to access the platform.'
                    : ' They will not be able to access the platform.'
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