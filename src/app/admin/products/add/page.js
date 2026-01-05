'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  FiUpload,
  FiX,
  FiArrowLeft,
  FiImage
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function AddProductPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '', 
    mrp: 0, 
    price: 0, 
    stock: 0,
    minStock: 0,
    weight: '',
    dimensions: '',
    model: '',
    status: 'draft',
  });

  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = await getToken();
        const response = await axios.get(`${baseUrl}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const formattedCategories = response.data.data.map(cat => ({
            value: cat.id,
            label: cat.name
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || 'Failed to fetch categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [getToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => {
      const url = URL.createObjectURL(file);
      return {
        id: Date.now() + Math.random(),
        file,
        url,
        name: file.name
      };
    });

    setImages(prev => {
      const updated = [...prev, ...newImages];
      // Set first image as main image if no main image exists
      if (!mainImage && updated.length > 0) {
        setMainImage(updated[0]);
      }
      return updated;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeImage = (imageId) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // If removing main image, set new main image
      if (mainImage && mainImage.id === imageId) {
        setMainImage(filtered.length > 0 ? filtered[0] : null);
      }
      return filtered;
    });
  };

  const setAsMainImage = (image) => {
    setMainImage(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Prepare form data for API submission
    const formData = new FormData();

    // Add product data
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
      console.log(key, productData[key]);
    });

    // Add images
    images.forEach((image) => {
      formData.append(`images`, image.file);
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      const response = await axios.post(`${baseUrl}/api/store/product`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.message) {
        toast.success('Product added successfully!');
        // Redirect to products page
        router.push('/admin/products');
      } else {
        toast.error(response.data.message || 'Failed to add product');
        console.error('API error:', response.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Error adding product');
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Image Upload */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Thumbnail */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
              <h3 className="text-lg font-semibold text-gray-900">Thumbnail</h3>
            </div>

            {/* Main Image Display */}
            <div className="mb-4">
              {mainImage ? (
                <div className="relative">
                  <Image
                    src={mainImage.url}
                    alt="Main product"
                    width={300}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg border-2 border-orange-200"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(mainImage.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                    isDragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <div className="text-center">
                    <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Images Grid */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className={`relative cursor-pointer ${
                      mainImage?.id === image.id ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => setAsMainImage(image)}
                  >
                    <Image
                      src={image.url}
                      alt={`Product ${image.id}`}
                      width={64}
                      height={64}
                      className="w-full h-16 object-cover rounded border"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('file-upload').click()}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <FiUpload className="w-4 h-4" />
              Upload
            </button>

            <p className="text-xs text-gray-500 mt-2">
              Set product image. Only *.png, *.jpg and *.jpeg image files are accepted
            </p>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Published</span>
            </div>
            <select
              name="status"
              value={productData.status}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Product Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
            <select
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={productData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      rows={6}
                      className="w-full p-4 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>

                  {/* Price Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Actual Price ($)
                      </label>
                      <input
                        type="number"
                        name="mrp"
                        value={productData.mrp}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Category and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={productData.status}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Stock Quantity and Min Stock */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={productData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Stock Level
                      </label>
                      <input
                        type="number"
                        name="minStock"
                        value={productData.minStock}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Weight and Dimensions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={productData.weight}
                        onChange={handleInputChange}
                        placeholder="e.g. 1.5 kg"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions (L x W x H)
                      </label>
                      <input
                        type="text"
                        name="dimensions"
                        value={productData.dimensions}
                        onChange={handleInputChange}
                        placeholder="e.g. 10 x 5 x 3 cm"
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={productData.model}
                      onChange={handleInputChange}
                      placeholder="Enter product model (if any)"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Simpan
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}