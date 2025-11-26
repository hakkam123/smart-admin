'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiSave,
  FiEye,
  FiPlus,
  FiX,
  FiUpload,
  FiImage,
  FiTruck,
  FiPackage
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function EditProduct({ params }) {
  const id = React.use(params).id; // Use React.use() to unwrap the params Promise
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    mrp: 0, // Changed from comparePrice to mrp to match store form
    price: 0, // This was already present
    inStock: true, // Added inStock field
    stock: 0,
    minStock: 0,
    weight: '',
    dimensions: '',
    model: '',
    additionalInfo: '',
    status: 'draft',
    sku: '',
    barcode: '',
    shippingWeight: '',
    shippingLength: '',
    shippingWidth: '',
    shippingHeight: '',
    warranty: '',
    returnPolicy: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
  });

  // State for image management
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]); // Array of image indices to delete
  const [mainImage, setMainImage] = useState(null); // Track main image for product
  const [isDragOver, setIsDragOver] = useState(false); // Track drag over state

  // No additional states needed for tags and variants as we're not implementing them in the new UI

  // Categories for dropdown - prepare for API fetch
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Simulate loading product data
  const { getToken } = useAuth();
  const router = useRouter();

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
          // Format the API response to match the expected format for the dropdown using IDs
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

  const loadProductData = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      const response = await axios.get(`${baseUrl}/api/store/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // API response structure has product data inside a "product" field
      if (response.data && response.data.product) {
        const product = response.data.product;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          categoryId: product.categoryId || product.category?.id || '', // Use categoryId if available, otherwise get the ID from category object
          mrp: product.mrp || 0, // Use mrp field as specified in API documentation
          price: product.price || 0, // Use price field as specified in API documentation
          inStock: product.inStock !== undefined ? product.inStock : true, // Handle inStock field as specified in API documentation
          stock: product.stock || 0,
          minStock: product.minStock || 0,
          weight: product.weight || '',
          dimensions: product.dimensions || '',
          model: product.model || '',
          additionalInfo: product.additionalInfo || '',
          status: product.status || 'draft',
          sku: product.sku || '',
          barcode: product.barcode || '',
          shippingWeight: product.shippingWeight || '',
          shippingLength: product.shippingLength || '',
          shippingWidth: product.shippingWidth || '',
          shippingHeight: product.shippingHeight || '',
          warranty: product.warranty || '',
          returnPolicy: product.returnPolicy || '',
          tags: product.tags || '',
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
        });

        // Set existing images
        setExistingImages(product.images || []);
        setImagesToDelete([]); // Reset images to delete when loading
      } else {
        console.error('Product data not found in response:', response.data);
        toast.error('Product not found');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to fetch product data');
      console.error('Error loading product data:', error);
    } finally {
      setLoading(false);
    }
  }, [id, getToken]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  // Cleanup image preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      newImages.forEach(image => {
        if (image && image.previewUrl) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, [newImages]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Image management functions
  const handleImageUpload = (files) => {
    // Filter to only accept image files
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    const maxNewImages = 4 - (existingImages?.length || 0);

    // Filter new files to not exceed maximum (4 total images)
    const filesToAdd = imageFiles.slice(0, Math.max(0, maxNewImages - newImages.length));

    if (filesToAdd.length > 0) {
      // Create preview URLs for the new files using Object.assign to preserve File prototype
      const filesWithPreview = filesToAdd.map(file => Object.assign(file, {
        previewUrl: URL.createObjectURL(file)
      }));
      setNewImages(prev => {
        const updated = [...prev, ...filesWithPreview];
        // Set first new image as main if no main image exists
        if (!mainImage && existingImages.length === 0 && updated.length > 0) {
          setMainImage(updated[0]);
        }
        return updated;
      });
    }
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

  const handleDeleteExistingImage = (index) => {
    setImagesToDelete(prev => [...prev, index]);
    // If we're deleting the main image, update main image reference
    if (existingImages[index] === mainImage) {
      // Set a new main image if there are other existing images
      const remainingImages = existingImages.filter((_, i) => i !== index);
      if (remainingImages.length > 0) {
        setMainImage(remainingImages[0]);
      } else if (newImages.length > 0) {
        setMainImage(newImages[0]);
      } else {
        setMainImage(null);
      }
    }
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(prev => {
      // Clean up the preview URL for the image being removed
      const imageToRemove = prev[index];
      if (imageToRemove && imageToRemove.previewUrl) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      const updated = prev.filter((_, i) => i !== index);
      // If we're removing the main image, update main image reference
      if (imageToRemove === mainImage) {
        if (existingImages.length > 0) {
          setMainImage(existingImages[0]);
        } else if (updated.length > 0) {
          setMainImage(updated[0]);
        } else {
          setMainImage(null);
        }
      }

      return updated;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();

      // Create payload with the same structure as store add product
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.categoryId, // Use categoryId to match API expectation
        mrp: formData.mrp,
        price: formData.price,
        inStock: formData.inStock,
        stock: formData.stock,
        minStock: formData.minStock,
        weight: formData.weight,
        dimensions: formData.dimensions,
        model: formData.model,
        additionalInfo: formData.additionalInfo,
        status: formData.status,
        sku: formData.sku,
        barcode: formData.barcode,
        shippingWeight: formData.shippingWeight,
        shippingLength: formData.shippingLength,
        shippingWidth: formData.shippingWidth,
        shippingHeight: formData.shippingHeight,
        warranty: formData.warranty,
        returnPolicy: formData.returnPolicy,
        tags: formData.tags,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
      };

      // Convert payload to FormData since the API expects form data
      const productFormData = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined) {
          productFormData.append(key, payload[key]);
        }
      });

      // Add new images to form data - use the File object directly since we used Object.assign
      newImages.forEach((imageFile) => {
        productFormData.append('images', imageFile);
      });

      // Add images to delete if any
      if (imagesToDelete.length > 0) {
        productFormData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      const response = await axios.put(`${baseUrl}/api/store/product/${id}`, productFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.message) {
        toast.success('Product updated successfully!');
        // Redirect to product details page
        router.push(`/admin/products/${id}`);
      } else {
        toast.error(response.data.message || 'Failed to update product');
        console.error('API error:', response.data);
      }
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error?.response);
      console.error('Error request:', error?.request);

      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error.message || 'Error updating product';
      toast.error(errorMessage);
      console.error('Error updating product:', errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/products/${id}`}
            className="p-2 hover:bg-gray-300 text-gray-600 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/products/${id}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            Preview
          </Link>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            Update Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General Information
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'advanced'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Advanced Settings
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Information Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>

              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
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
                    value={formData.description}
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
                      value={formData.mrp}
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
                      value={formData.price}
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
                      name="categoryId"
                      value={formData.categoryId}
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
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* SKU and Barcode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Enter product SKU"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barcode
                    </label>
                    <input
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      placeholder="Enter product barcode (if any)"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* In Stock and Stock Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      In Stock
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                        className="w-5 h-5"
                      />
                      <span className="ml-2">Product is in stock</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Min Stock and Weight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Stock Level
                    </label>
                    <input
                      type="number"
                      name="minStock"
                      value={formData.minStock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g. 1.5 kg"
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (L x W x H)
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g. 10 x 5 x 3 cm"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Enter product model (if any)"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Additional product information"
                    rows={4}
                    className="w-full p-4 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>

                {/* Image Management */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>

                  <div className="space-y-6">
                    {/* Drag and Drop Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
                      }`}
                      onClick={() => document.getElementById('file-upload').click()}
                      onDrop={(e) => handleDrop(e)}
                      onDragOver={(e) => handleDragOver(e)}
                      onDragLeave={() => handleDragLeave()}
                    >
                      <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-1">Drag and drop images here</p>
                      <p className="text-sm text-gray-500">
                        or click to browse (max {4 - (existingImages?.length || 0)} more)
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Only *.png, *.jpg and *.jpeg image files are accepted
                      </p>
                    </div>

                    {/* Hidden file input */}
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />

                    {/* Current Images */}
                    {existingImages && existingImages.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Images
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {existingImages.map((image, index) => (
                            <div
                              key={index}
                              className={`relative ${imagesToDelete.includes(index) ? 'opacity-50' : ''}`}
                              onClick={() => !imagesToDelete.includes(index) && setMainImage(image)}
                            >
                              <Image
                                src={image}
                                alt={`Product ${index + 1}`}
                                width={128}
                                height={128}
                                className={`w-full h-32 object-cover rounded-lg border ${
                                  mainImage === image ? 'border-2 border-orange-500' : 'border-gray-200'
                                } ${imagesToDelete.includes(index) ? 'grayscale' : ''}`}
                              />
                              {!imagesToDelete.includes(index) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteExistingImage(index);
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <FiX className="w-3 h-3" />
                                </button>
                              )}
                              {imagesToDelete.includes(index) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                  <span className="text-white text-xs font-semibold">DELETED</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Images Preview */}
                    {newImages.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Images
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {newImages.map((file, index) => (
                            <div key={`new-${index}`} className="relative">
                              <Image
                                src={file.previewUrl}
                                alt={`New ${index + 1}`}
                                width={128}
                                height={128}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveNewImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <FiX className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiTruck className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="text"
                    name="shippingWeight"
                    value={formData.shippingWeight}
                    onChange={handleInputChange}
                    placeholder="e.g. 2.0 kg"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length (cm)
                  </label>
                  <input
                    type="text"
                    name="shippingLength"
                    value={formData.shippingLength}
                    onChange={handleInputChange}
                    placeholder="e.g. 30 cm"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (cm)
                  </label>
                  <input
                    type="text"
                    name="shippingWidth"
                    value={formData.shippingWidth}
                    onChange={handleInputChange}
                    placeholder="e.g. 20 cm"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="text"
                    name="shippingHeight"
                    value={formData.shippingHeight}
                    onChange={handleInputChange}
                    placeholder="e.g. 15 cm"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Warranty and Return Policy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="e.g. 1 Year"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Policy
                  </label>
                  <input
                    type="text"
                    name="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={handleInputChange}
                    placeholder="e.g. 30 Days"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags separated by commas (e.g., electronics, gadget, new)"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* SEO Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiPackage className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">SEO Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    placeholder="Enter meta title for SEO"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    placeholder="Enter meta description for SEO"
                    rows={3}
                    className="w-full p-4 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}