'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
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

export default function EditProductPage() {
  const params = useParams();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    categories: [],
    mrp: '',
    price: 0,
    weight: '',
    dimensions: '',
    status: 'draft',
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
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

  // Fetch product data
  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      const response = await axios.get(`${baseUrl}/api/store/product/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const product = response.data.product;

      setProductData({
        name: product.name || '',
        description: product.description || '',
        categories: product.allCategoryIds || [product.categoryId],
        mrp: product.mrp || '',
        price: product.price || 0,
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        status: product.status || 'draft',
      });

      setExistingImages(product.images || []);

      // Set variants from product
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants.map(v => ({
          id: v.id,
          name: v.variant,
          stock: v.stock
        })));
      }

      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to fetch product');
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

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
        name: file.name,
        isNew: true
      };
    });

    setImages(prev => [...prev, ...newImages]);
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

  const removeNewImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const removeExistingImage = (index) => {
    setImagesToDelete(prev => [...prev, index]);
    setExistingImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const totalImages = existingImages.length + images.length;
    if (totalImages === 0) {
      toast.error('Please upload at least one product image');
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

    // Prepare form data
    const formData = new FormData();

    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('stock', totalStock);
    formData.append('weight', productData.weight);
    formData.append('dimensions', productData.dimensions);
    formData.append('status', productData.status);

    if (productData.mrp) {
      formData.append('mrp', productData.mrp);
    }

    formData.append('categories', JSON.stringify(productData.categories));
    formData.append('variants', JSON.stringify(validVariants));

    // Add new images
    images.forEach((image) => {
      formData.append(`images`, image.file);
    });

    // Add images to delete
    if (imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      const response = await axios.put(`${baseUrl}/api/store/product/${params.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.message) {
        toast.success('Product updated successfully!');
        router.push('/admin/products');
      } else {
        toast.error(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || 'Error updating product');
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Images */}
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
                Product Images <span className="text-red-500">*</span>
              </h3>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Images</p>
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <Image
                        src={img}
                        alt={`Product ${idx + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-16 object-cover rounded border"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">New Images</p>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <Image
                        src={image.url}
                        alt={image.name}
                        width={64}
                        height={64}
                        className="w-full h-16 object-cover rounded border"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(image.id)}
                        className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div
              className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${isDragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('file-upload-edit').click()}
            >
              <div className="text-center">
                <FiImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click or drag to upload</p>
              </div>
            </div>

            <input
              id="file-upload-edit"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('file-upload-edit').click()}
              className="w-full mt-3 py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <FiUpload className="w-4 h-4" />
              Upload More
            </button>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
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

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Categories <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-gray-500 mb-3">Select at least one category</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categoriesLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-gray-500">No categories</p>
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
                {productData.categories.length} selected
              </p>
            )}
          </div>
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
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
                  required
                  rows={6}
                  className="w-full p-4 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Prices */}
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
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional</p>
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

              {/* Models */}
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

              {/* Weight & Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="text"
                    name="weight"
                    value={productData.weight}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={productData.dimensions}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
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
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}