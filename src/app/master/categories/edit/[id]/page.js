'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiArrowLeft, 
  FiSave,
  FiUpload,
  FiX,
  FiTag
} from 'react-icons/fi';

export default function EditCategoryPage({ params }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'Active',
    parentCategory: '',
    sortOrder: 0,
    image: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  useEffect(() => {
    // Mock category data - replace with actual API call
    const mockCategoriesData = [
      {
        id: '1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'All electronic devices and gadgets including smartphones, laptops, and accessories',
        status: 'Active',
        productsCount: 156,
        parentCategory: '',
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
        parentCategory: '',
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
        if (foundCategory) {
          setCategory(foundCategory);
          setFormData({
            name: foundCategory.name,
            slug: foundCategory.slug,
            description: foundCategory.description,
            status: foundCategory.status,
            parentCategory: foundCategory.parentCategory || '',
            sortOrder: foundCategory.sortOrder,
            image: foundCategory.image,
            metaTitle: foundCategory.metaTitle,
            metaDescription: foundCategory.metaDescription,
            metaKeywords: foundCategory.metaKeywords
          });
        }
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

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug when name changes
      ...(name === 'name' && { slug: generateSlug(value) })
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, upload to server and get URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updated category:', formData);
      // In real app: await updateCategory(params.id, formData);
      
      // Redirect back to category detail
      // router.push(`/master/categories/${params.id}`);
      alert('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category');
    } finally {
      setSaving(false);
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
          <p className="mt-1 text-sm text-gray-500">The category you&apos;re trying to edit doesn&apos;t exist.</p>
          <div className="mt-6">
            <Link
              href="/master/categories"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
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
              href={`/master/categories/${params.id}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
              <p className="text-sm text-gray-500">Update category information</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 text-gray-500  rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      Slug *
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 text-gray-500  rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">URL-friendly version of the name</p>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 text-gray-500  rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                      placeholder="Describe your category..."
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 text-gray-500  rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      id="sortOrder"
                      name="sortOrder"
                      value={formData.sortOrder}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 text-gray-500  rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700">
                      Parent Category
                    </label>
                    <select
                      id="parentCategory"
                      name="parentCategory"
                      value={formData.parentCategory}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 text-gray-500 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                    >
                      <option value="">None (Top Level)</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="books">Books</option>
                    </select>
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
                <div className="space-y-4">
                  {formData.image ? (
                    <div className="relative">
                      <Image
                        src={formData.image}
                        alt="Category"
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FiTag className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">No image selected</p>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="image" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <FiUpload className="mr-2 h-4 w-4" />
                      {formData.image ? 'Change Image' : 'Upload Image'}
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      JPG, PNG or GIF. Max file size 2MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        Update
                      </>
                    )}
                  </button>
                  
                  <Link
                    href={`/master/categories/${params.id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}