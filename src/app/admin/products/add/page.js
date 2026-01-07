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
  FiImage,
  FiPlus,
  FiTrash2
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
    categories: [], // Changed to array for multiple categories
    mrp: '', // Actual Price (optional)
    price: 0, // Offer price (required)
    weight: '',
    dimensions: '',
    status: 'draft',
  });

  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Product variants (models)
  const [variants, setVariants] = useState([
    { id: Date.now(), name: '', stock: 0 }
  ]);

  // Calculate total stock from variants
  const totalStock = variants.reduce((sum, variant) => sum + (parseInt(variant.stock) || 0), 0);

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

  // Handle category selection (multiple)
  const handleCategoryChange = (categoryId) => {
    setProductData(prev => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories };
    });
  };

  // Variant handlers
  const addVariant = () => {
    setVariants(prev => [...prev, { id: Date.now(), name: '', stock: 0 }]);
  };

  const removeVariant = (id) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter(v => v.id !== id));
    }
  };

  const updateVariant = (id, field, value) => {
    setVariants(prev => prev.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ));
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

    // Validation
    if (!mainImage) {
      toast.error('Please upload at least one product image (thumbnail)');
      return;
    }

    if (productData.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    if (!productData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!productData.description.trim()) {
      toast.error('Product description is required');
      return;
    }

    if (!productData.price || productData.price <= 0) {
      toast.error('Offer price is required and must be greater than 0');
      return;
    }

    if (totalStock <= 0) {
      toast.error('Total stock must be greater than 0');
      return;
    }

    // Validate variants
    const validVariants = variants.filter(v => v.name.trim() && v.stock > 0);
    if (validVariants.length === 0) {
      toast.error('Please add at least one model with name and stock');
      return;
    }

    setIsSubmitting(true);

    // Prepare form data for API submission
    const formData = new FormData();

    // Add product data
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('stock', totalStock);
    formData.append('weight', productData.weight);
    formData.append('dimensions', productData.dimensions);
    formData.append('status', productData.status);

    // Add mrp if provided
    if (productData.mrp) {
      formData.append('mrp', productData.mrp);
    }

    // Add categories as JSON string
    formData.append('categories', JSON.stringify(productData.categories));

    // Add variants as JSON string
    formData.append('variants', JSON.stringify(validVariants));

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
                type="button"
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                Thumbnail <span className="text-red-500">*</span>
              </h3>
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
                  className={`w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${isDragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
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
                    className={`relative cursor-pointer ${mainImage?.id === image.id ? 'ring-2 ring-orange-500' : ''
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

          {/* Product Categories (Multiple Selection) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Categories <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-gray-500 mb-3">Select at least one category</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categoriesLoading ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-gray-500">No categories available</p>
              ) : (
                categories.map(category => (
                  <label key={category.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={productData.categories.includes(category.value)}
                      onChange={() => handleCategoryChange(category.value)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{category.label}</span>
                  </label>
                ))
              )}
            </div>
            {productData.categories.length > 0 && (
              <p className="text-xs text-green-600 mt-2">
                {productData.categories.length} categor{productData.categories.length > 1 ? 'ies' : 'y'} selected
              </p>
            )}
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
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    required
                    rows={6}
                    className="w-full p-4 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>

                {/* Price Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Price (Rp)
                    </label>
                    <input
                      type="number"
                      name="mrp"
                      value={productData.mrp}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional - Original price before discount
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Price (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={productData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {productData.mrp && productData.price && productData.mrp > productData.price && (
                      <p className="text-xs text-green-600 mt-1">
                        💰 Discount: {Math.round(((productData.mrp - productData.price) / productData.mrp) * 100)}% off
                      </p>
                    )}
                  </div>
                </div>

                {/* Product Models/Variants */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Models <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Model
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Add different models/variants for this product. Total stock will be calculated automatically.
                  </p>
                  <div className="space-y-3">
                    {variants.map((variant, index) => (
                      <div key={variant.id} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                            placeholder={`Model name ${index + 1}`}
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                            placeholder="Stock"
                            min="0"
                            className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(variant.id)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Total Stock:</strong> {totalStock} units
                    </p>
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
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
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
                  Save Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}