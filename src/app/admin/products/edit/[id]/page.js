'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiArrowLeft,
  FiSave,
  FiEye,
  FiPlus,
  FiX,
  FiUpload,
  FiImage
} from 'react-icons/fi';

export default function EditProduct({ params }) {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    sku: '',
    stock: '',
    description: '',
    shortDescription: '',
    tags: [],
    status: 'active',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    shipping: {
      freeShipping: false,
      shippingClass: '',
      processingTime: ''
    },
    variants: []
  });

  const [newTag, setNewTag] = useState('');
  const [newVariant, setNewVariant] = useState({
    name: '',
    values: ['']
  });

  // Simulate loading product data
  useEffect(() => {
    // In a real app, you would fetch the product data based on params.id
    const loadProductData = async () => {
      // Simulate API call
      setTimeout(() => {
        setFormData({
          name: 'Premium Wireless Headphones',
          category: 'Electronics',
          price: '299.99',
          comparePrice: '399.99',
          costPrice: '150.00',
          sku: 'WH-001',
          stock: '25',
          description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
          shortDescription: 'Premium wireless headphones with noise cancellation',
          tags: ['electronics', 'audio', 'wireless', 'premium'],
          status: 'active',
          featured: true,
          seoTitle: 'Premium Wireless Headphones - Best Audio Experience',
          seoDescription: 'Experience premium sound quality with our wireless headphones featuring noise cancellation technology.',
          seoKeywords: 'wireless headphones, audio, music, noise cancellation',
          weight: '0.3',
          dimensions: {
            length: '20',
            width: '18',
            height: '8'
          },
          shipping: {
            freeShipping: true,
            shippingClass: 'standard',
            processingTime: '1-2'
          },
          variants: [
            {
              name: 'Color',
              values: ['Black', 'White', 'Blue']
            },
            {
              name: 'Size',
              values: ['Standard', 'Large']
            }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    loadProductData();
  }, [params.id]);

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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addVariant = () => {
    if (newVariant.name && newVariant.values[0]) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant }]
      }));
      setNewVariant({ name: '', values: [''] });
    }
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addVariantValue = (variantIndex) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, index) => 
        index === variantIndex 
          ? { ...variant, values: [...variant.values, ''] }
          : variant
      )
    }));
  };

  const updateVariantValue = (variantIndex, valueIndex, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, index) => 
        index === variantIndex 
          ? { 
              ...variant, 
              values: variant.values.map((val, valIndex) => 
                valIndex === valueIndex ? value : val
              )
            }
          : variant
      )
    }));
  };

  const removeVariantValue = (variantIndex, valueIndex) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, index) => 
        index === variantIndex 
          ? { 
              ...variant, 
              values: variant.values.filter((_, valIndex) => valIndex !== valueIndex)
            }
          : variant
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Updated Product Data:', formData);
    // In a real app, you would make an API call to update the product
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
            href={`/admin/products/${params.id}`}
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
            href={`/admin/products/${params.id}`}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Brief product description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Detailed product description..."
                    />
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</div>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FiUpload className="w-4 h-4 inline mr-2" />
                    Choose Files
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compare Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="comparePrice"
                        value={formData.comparePrice}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter SKU..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              {/* Product Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Featured Product
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Category */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Toys">Toys</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Food">Food</option>
                  </select>
                </div>
              </div>

              {/* Product Tags */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Add tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-orange-600 hover:text-orange-800"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings Tab */}
        {activeTab === 'advanced' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* SEO Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={formData.seoTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter SEO title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      name="seoDescription"
                      value={formData.seoDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter SEO description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      name="seoKeywords"
                      value={formData.seoKeywords}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter keywords separated by commas..."
                    />
                  </div>
                </div>
              </div>

              {/* Product Variants */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h3>
                
                {/* Add New Variant */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newVariant.name}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Variant name (e.g., Color, Size)..."
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newVariant.values[0]}
                        onChange={(e) => setNewVariant(prev => ({ 
                          ...prev, 
                          values: [e.target.value, ...prev.values.slice(1)]
                        }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Variant value..."
                      />
                      <button
                        type="button"
                        onClick={addVariant}
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                      >
                        Add Variant
                      </button>
                    </div>
                  </div>
                </div>

                {/* Existing Variants */}
                <div className="space-y-4">
                  {formData.variants.map((variant, variantIndex) => (
                    <div key={variantIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{variant.name}</h4>
                        <button
                          type="button"
                          onClick={() => removeVariant(variantIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {variant.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => updateVariantValue(variantIndex, valueIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantValue(variantIndex, valueIndex)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addVariantValue(variantIndex)}
                          className="text-sm text-orange-600 hover:text-orange-800"
                        >
                          + Add Value
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Shipping Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      step="0.1"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        name="dimensions.length"
                        value={formData.dimensions.length}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Length"
                      />
                      <input
                        type="number"
                        name="dimensions.width"
                        value={formData.dimensions.width}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Width"
                      />
                      <input
                        type="number"
                        name="dimensions.height"
                        value={formData.dimensions.height}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Height"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="shipping.freeShipping"
                      checked={formData.shipping.freeShipping}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Free Shipping
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Class
                    </label>
                    <select
                      name="shipping.shippingClass"
                      value={formData.shipping.shippingClass}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select class</option>
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                      <option value="overnight">Overnight</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Processing Time (days)
                    </label>
                    <input
                      type="text"
                      name="shipping.processingTime"
                      value={formData.shipping.processingTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 1-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}