'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiUsers,
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
  FiShield,
  FiRefreshCw
} from 'react-icons/fi';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    // Mock users data - replace with actual API call
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+62 812-3456-7890',
        avatar: '/images/users/john.jpg',
        role: 'customer',
        registeredAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-01-19T14:30:00Z',
        address: 'Jakarta, Indonesia',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        totalOrders: 12,
        totalSpent: 'Rp 2,450,000'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        phone: '+62 813-9876-5432',
        avatar: '/images/users/jane.jpg',
        role: 'customer',
        registeredAt: '2024-01-10T14:20:00Z',
        lastLogin: '2024-01-20T09:15:00Z',
        address: 'Bandung, Indonesia',
        dateOfBirth: '1985-08-22',
        gender: 'Female',
        totalOrders: 8,
        totalSpent: 'Rp 1,890,000'
      },
      {
        id: '3',
        name: 'Ahmad Rahman',
        email: 'ahmad.rahman@gmail.com',
        phone: '+62 814-5555-1234',
        avatar: '/images/users/ahmad.jpg',
        role: 'vendor',
        registeredAt: '2024-01-12T16:45:00Z',
        lastLogin: '2024-01-18T12:30:00Z',
        address: 'Surabaya, Indonesia',
        dateOfBirth: '1992-12-03',
        gender: 'Male',
        totalOrders: 25,
        totalSpent: 'Rp 5,670,000'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@tech.com',
        phone: '+62 815-7777-8888',
        avatar: '/images/users/sarah.jpg',
        role: 'vendor',
        registeredAt: '2024-01-18T11:20:00Z',
        lastLogin: null,
        address: 'Medan, Indonesia',
        dateOfBirth: '1988-03-17',
        gender: 'Female',
        totalOrders: 0,
        totalSpent: 'Rp 0'
      },
      {
        id: '5',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+62 816-9999-0000',
        avatar: '/images/users/michael.jpg',
        role: 'customer',
        registeredAt: '2024-01-05T08:30:00Z',
        lastLogin: '2024-01-19T14:45:00Z',
        address: 'Yogyakarta, Indonesia',
        dateOfBirth: '1995-09-28',
        gender: 'Male',
        totalOrders: 15,
        totalSpent: 'Rp 3,210,000'
      }
    ];

    // Simulate API call
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const getActivityColor = (lastLogin) => {
    if (!lastLogin) return 'bg-gray-100 text-gray-800';
    
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const daysDiff = Math.floor((now - loginDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) return 'bg-green-100 text-green-800';
    if (daysDiff <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getActivityStatus = (lastLogin) => {
    if (!lastLogin) return 'Never Login';
    
    const loginDate = new Date(lastLogin);
    const now = new Date();
    const daysDiff = Math.floor((now - loginDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) return 'Active';
    if (daysDiff <= 7) return 'Recent';
    return 'Inactive';
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

  const getActionButtons = (user) => {
    return (
      <Link 
        href={`/master/users/${user.id}`}
        className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-gray-100" 
        title="View User Details"
      >
        <FiEye className="h-4 w-4" />
      </Link>
    );
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
                    <div className="rounded-full bg-gray-300 h-10 w-10"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Users Monitoring</h1>
            <p className="text-sm text-gray-500">Monitor registered users and their activities</p>
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

      {/* Filters and Search */}
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUsers className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FiMail className="mr-1 h-4 w-4 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <FiPhone className="mr-1 h-4 w-4 text-gray-400" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getActivityColor(user.lastLogin)}`}>
                      <span>{getActivityStatus(user.lastLogin)}</span>
                    </span>
                    {user.lastLogin && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-sm font-medium">{user.totalOrders} orders</div>
                    <div className="text-sm text-gray-500">{user.totalSpent}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1 h-4 w-4 text-gray-400" />
                      {new Date(user.registeredAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {getActionButtons(user)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No users have registered yet.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium">{users.length}</span> results
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