'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import {
  FiArrowLeft,
  FiSave,
  FiX,
  FiCamera,
  FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function EditShopPage({ params }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [shopData, setShopData] = useState({
    name: '',
    ownerName: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    shopImage: '/api/placeholder/150/150',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Load shop data when component mounts
  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      const response = await axios.get(`${baseUrl}/api/store`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const storeData = response.data.data;

        // Map API response to shopData format
        setShopData({
          name: storeData.name,
          ownerName: storeData.user?.name || '',
          address: storeData.address,
          email: storeData.email,
          phone: storeData.contact,
          website: storeData.website || '',
          description: storeData.description,
          shopImage: storeData.logo || '/api/placeholder/150/150',
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to fetch shop data');
      console.error('Error loading shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setShopData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setShopData(prev => ({
          ...prev,
          shopImage: reader.result,
          shopImageFile: file // Store the actual file for upload
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!shopData.name.trim()) newErrors.name = 'Shop name is required';
    if (!shopData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!shopData.email.trim()) newErrors.email = 'Email is required';
    if (!shopData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shopData.address.trim()) newErrors.address = 'Address is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shopData.email && !emailRegex.test(shopData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (shopData.phone && !phoneRegex.test(shopData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      
      // Prepare form data for API request
      const storeData = new FormData();
      storeData.append('name', shopData.name);
      storeData.append('username', shopData.name.toLowerCase().replace(/\s+/g, '_')); // Create a username from name
      storeData.append('description', shopData.description);
      storeData.append('email', shopData.email);
      storeData.append('contact', shopData.phone);
      storeData.append('address', shopData.address);
      storeData.append('website', shopData.website || '');

      // Add image if provided
      if (shopData.shopImageFile) {
        storeData.append('logo', shopData.shopImageFile);
      }

      const response = await axios.put(`${baseUrl}/api/store`, storeData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Shop information updated successfully!');
        router.push(`/admin/shops`);
      } else {
        toast.error(response.data.message || 'Failed to update shop');
        console.error('API error:', response.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Error updating shop');
      console.error('Error updating shop data:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/shops"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {params?.id ? 'Edit Shop' : 'Add New Shop'}
            </h1>
            <p className="text-gray-600">
              {params?.id ? 'Update shop information and settings' : 'Create a new online shop profile'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/shops"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiX className="mr-2 h-4 w-4" />
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Shop'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Shop Preview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Shop Image Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Image</h3>
            <div className="text-center">
              <div className="relative inline-block">
                <Image
                  src={imagePreview || shopData.shopImage}
                  alt="Shop preview"
                  width={120}
                  height={120}
                  className="rounded-full mx-auto border-2 border-gray-200"
                  unoptimized
                />
                <label className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 cursor-pointer">
                  <FiCamera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="mt-4 space-y-2">
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setShopData(prev => ({
                        ...prev,
                        shopImage: '',
                        shopImageFile: null
                      }));
                    }}
                    className="w-full px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    <FiTrash2 className="inline h-4 w-4 mr-2" />
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  value={shopData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter shop name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={shopData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.ownerName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter owner name"
                />
                {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={shopData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter full address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={shopData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={shopData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={shopData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={shopData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Describe your shop and what you sell"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}