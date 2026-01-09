'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import {
  FiArrowLeft,
  FiUpload,
  FiImage
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data is loaded
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

  // Auto generate slug from name (only after data is loaded and user changes name)
  useEffect(() => {
    if (formData.name && isDataLoaded) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, isDataLoaded]);

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = await getToken();
        const response = await axios.get(`${baseUrl}/api/categories/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const cat = response.data.data;
          setFormData({
            name: cat.name || '',
            description: cat.description || '',
            image: cat.image || '',
            imageFile: null,
            status: cat.status ? cat.status.toLowerCase() : 'active',
            slug: cat.slug || '',
            metaTitle: cat.metaTitle || '',
            metaDescription: cat.metaDescription || '',
            parentCategory: cat.parentCategoryId || ''
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || 'Failed to fetch category');
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
        setIsDataLoaded(true); // Mark data as loaded
      }
    };

    if (id) {
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [id, params.id, getToken]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : name === 'sortOrder'
          ? parseInt(value) || 0
          : value
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

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: '',
      imageFile: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();

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

      const response = await axios.put(`${baseUrl}/api/categories/${params.id}`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Category updated successfully');
        router.push(`/master/categories`);
      } else {
        toast.error(response.data.message || 'Failed to update category');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Error updating category');
      console.error('Error updating category:', error?.response?.data?.message || error.message || 'Error updating category');
    } finally {
      setSaving(false);
    }
  };

  const mockParentCategories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Home & Garden' },
    { id: 4, name: 'Sports' },
    { id: 5, name: 'Books' }
  ];

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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-600">Update category information</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/master/categories/${id}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving || !formData.name}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {saving ? 'Updating...' : 'Update'}
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
                  className="w-full pl-5 text-gray-500 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                  className="w-full pl-5 text-gray-500 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                  {formData.image ? 'Change Image' : 'Choose File'}
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
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-700">Image Preview</p>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
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