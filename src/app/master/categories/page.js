'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit3,
  FiTrash2,
  FiEye,
  FiTag,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { getToken } = useAuth();
  
  // Categories state
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  const fetchCategories = React.useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      const { data } = await axios.get(`${baseUrl}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        const formattedCategories = data.data.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          image: cat.image,
          status: cat.status.toLowerCase(),
          slug: cat.slug,
          productsCount: cat.productsCount || 0,
          createdAt: new Date(cat.createdAt).toISOString().split('T')[0]
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setDeleting(id);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = await getToken();
        const response = await axios.delete(`${baseUrl}/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          toast.success('Category deleted successfully');
          setCategories(prev => prev.filter(cat => cat.id !== id));
        } else {
          toast.error(response.data.message || 'Failed to delete category');
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || 'Error deleting category');
      } finally {
        setDeleting(null);
      }
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || category.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
            <p className="text-gray-600 mt-1">Manage product categories and classifications</p>
          </div>
          <Link
            href="/master/categories/add"
            className="inline-flex items-center px-4 py-2 bg-slate-600 text-[12px] text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Add Category
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1">Manage product categories and classifications</p>
        </div>
        <Link
          href="/master/categories/add"
          className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          Add Category
        </Link>
      </div>
    
      {/* Filters */}
      <div className="bg-white rounded-lg border p-3">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border text-[12px] border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border text-[12px] border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>


        </div>
      </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FiTag className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                      <p className="text-gray-500">No categories match your current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <FiTag className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">Slug: {category.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {category.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link 
                        href={`/master/categories/${category.id}`}
                        className="text-slate-600 hover:text-slate-900 p-1 rounded hover:bg-gray-100" 
                        title="View Details"
                      >
                        <FiEye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/master/categories/edit/${category.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit Category"
                      >
                        <FiEdit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className={`p-1 rounded hover:bg-red-50 ${deleting === category.id ? 'text-gray-400' : 'text-red-600 hover:text-red-900'}`}
                        title="Delete Category"
                        disabled={deleting === category.id}
                      >
                        {deleting === category.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                        ) : (
                          <FiTrash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCategories.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 bg-white mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                <div className="flex space-x-1">
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
                        onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FiTag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first category.'
            }
          </p>
          {!searchTerm && selectedStatus === 'all' && (
            <Link
              href="/master/categories/add"
              className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add First Category
            </Link>
          )}
        </div>
      )}
    </div>
  );
}