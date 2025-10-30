'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiTrash2,
  FiTag,
  FiCalendar,
  FiPackage,
  FiToggleLeft,
  FiToggleRight,
  FiSettings
} from 'react-icons/fi';

export default function CategoryDetailPage({ params }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);



  useEffect(() => {
    const mockCategoriesData = [
      {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'All electronic devices and gadgets including smartphones, laptops, and accessories',
        status: 'Active',
        productsCount: 156,
        parentCategory: null,
        image: '/images/categories/electronics.jpg',
        metaTitle: 'Electronics - Best Gadgets and Devices',
        metaDescription: 'Shop the latest electronics, smartphones, laptops, and tech accessories at great prices.',
        metaKeywords: 'electronics, gadgets, smartphones, laptops, tech',
        sortOrder: 1,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T15:45:00Z',
        createdBy: 'Admin User',
        updatedBy: 'Admin User'
      },
      {
        id: '2',
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing, shoes, and accessories for men and women',
        status: 'Active',
        productsCount: 234,
        parentCategory: null,
        image: '/images/categories/fashion.jpg',
        metaTitle: 'Fashion - Latest Trends and Styles',
        metaDescription: 'Discover the latest fashion trends for men and women. Quality clothing and accessories.',
        metaKeywords: 'fashion, clothing, shoes, accessories, trends',
        sortOrder: 2,
        createdAt: '2024-01-16T14:20:00Z',
        updatedAt: '2024-01-18T09:15:00Z',
        createdBy: 'Fashion Admin',
        updatedBy: 'Fashion Admin'
      }
    ];

    // Simulate API call
    const fetchCategory = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const foundCategory = mockCategoriesData.find(cat => cat.id === params.id);
        setCategory(foundCategory);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  const handleToggleStatus = () => {
    if (category) {
      const newStatus = category.status === 'Active' ? 'Inactive' : 'Active';
      setCategory(prev => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date().toISOString()
      }));
      // Here you would make an API call to update the status
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle category deletion
    console.log('Deleting category:', category.id);
    setShowDeleteModal(false);
    // Redirect to categories list after deletion
    // router.push('/master/categories');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (!category) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FiTag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Category not found</h3>
          <p className="mt-1 text-sm text-gray-500">The category you&apos;re looking for doesn&apos;t exist.</p>
          <div className="mt-6">
            <Link
              href="/master/categories"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
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
              href="/master/categories"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-sm text-gray-500">Category Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleStatus}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                category.status === 'Active' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {category.status === 'Active' ? (
                <>
                  <FiToggleRight className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <FiToggleLeft className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </button>
            <Link
              href={`/master/categories/edit/${category.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
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
                  <label className="text-sm font-medium text-gray-700">Category Name</label>
                  <p className="mt-1 text-sm text-gray-900">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Slug</label>
                  <p className="mt-1 text-sm text-gray-900">{category.slug}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{category.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                      {category.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Products Count</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FiPackage className="mr-1 h-4 w-4 text-gray-400" />
                    {category.productsCount} products
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Activity Log */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Activity Log</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="shrink-0">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleString()} by {category.createdBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="shrink-0">
                    <FiSettings className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-500">
                      {new Date(category.updatedAt).toLocaleString()} by {category.updatedBy}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Image */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Category Image</h3>
            </div>
            <div className="p-6">
              <div className="text-center">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="mx-auto h-48 w-48 rounded-lg object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="mx-auto h-48 w-48 rounded-lg bg-gray-200 flex items-center justify-center">
                    <FiTag className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">Category thumbnail</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Category</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete &quot;{category.name}&quot;? This action cannot be undone.
                  All products in this category will need to be reassigned.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-3 hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
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
