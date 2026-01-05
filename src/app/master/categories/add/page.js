'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import {
  FiArrowLeft,
  FiUpload,
  FiImage,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function AddCategoryPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    imageFile: null, 
    status: 'active',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    parentCategory: ''
  });

  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        image: previewUrl,
        imageFile: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      
      // Prepare form data for API request
      const categoryData = new FormData();
      categoryData.append('name', formData.name);
      categoryData.append('description', formData.description);
      categoryData.append('status', formData.status);
      categoryData.append('slug', formData.slug);
      categoryData.append('metaTitle', formData.metaTitle);
      categoryData.append('metaDescription', formData.metaDescription);
      
      // Add image if provided as File object
      if (formData.imageFile) {
        categoryData.append('image', formData.imageFile);
      }
      
      // Add parent category if selected
      if (formData.parentCategory) {
        categoryData.append('parentCategoryId', formData.parentCategory);
      }

      const response = await axios.post(`${baseUrl}/api/categories`, categoryData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Category created successfully');
        router.push('/master/categories');
      } else {
        toast.error(response.data.message || 'Failed to create category');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  const mockParentCategories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Home & Garden' },
    { id: 4, name: 'Sports' },
    { id: 5, name: 'Books' }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/master/categories"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
            <p className="text-gray-600">Create a new product category</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/master/categories"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.name}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-5 pr-3 py-3 border text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Enter category name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pl-5 pr-3 py-3 border text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Enter category description"
                  />
                </div>
              </div>
            </div>
          </div>

        {/* Category Image */}
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Category Image</h2>
            </div>

            <div className="space-y-4">
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <FiUpload className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-slate-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <FiImage className="w-4 h-4 mr-2" />
                    Choose File
                  </label>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview</p>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Image 
                      src={formData.image} 
                      alt="Preview" 
                      width={200}
                      height={160}
                      className="max-h-40 rounded object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
      </form>
    </div>
  );
}