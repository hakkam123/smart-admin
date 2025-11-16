'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiUpload, 
  FiX,
  FiArrowLeft,
  FiImage,
  FiPlus,
  FiMinus,
  FiInfo
} from 'react-icons/fi';

export default function AddProductPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    weight: '',
    dimensions: '',
    model: '',
    additionalInfo: '',
    status: 'published',
    // Advanced fields
    sku: '',
    barcode: '',
    minStock: '',
    shippingWeight: '',
    shippingLength: '',
    shippingWidth: '',
    shippingHeight: '',
    warranty: '',
    returnPolicy: '',
    tags: '',
    metaTitle: '',
    metaDescription: ''
  });

  // Product Stock variants for Advanced tab
  const [productVariants, setProductVariants] = useState([
    { id: 1, variant: 'Produk A', stock: '' },
    { id: 2, variant: 'Produk B', stock: '' },
    { id: 3, variant: 'Produk C', stock: '' },
    { id: 4, variant: 'Produk D', stock: '' },
    { id: 5, variant: 'Produk E', stock: '' }
  ]);

  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Categories for dropdown - prepare for API fetch
  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariantChange = (id, field, value) => {
    setProductVariants(prev => 
      prev.map(variant => 
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  const addVariant = () => {
    const newId = Math.max(...productVariants.map(v => v.id)) + 1;
    setProductVariants(prev => [...prev, { 
      id: newId, 
      variant: `Produk ${String.fromCharCode(65 + prev.length)}`, 
      stock: '' 
    }]);
  };

  const removeVariant = (id) => {
    setProductVariants(prev => prev.filter(variant => variant.id !== id));
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
    
    // Prepare form data for API submission
    const formData = new FormData();
    
    // Add product data
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });

    // Add images
    images.forEach((image, index) => {
      formData.append(`images`, image.file);
      if (image.id === mainImage?.id) {
        formData.append('mainImageIndex', index);
      }
    });

    try {
      // TODO: Replace with actual API endpoint
      console.log('Product data to submit:', productData);
      console.log('Images to upload:', images);
      
      // Example API call:
      // const response = await fetch('/api/products', {
      //   method: 'POST',
      //   body: formData
      // });
      
      alert('Product would be saved! (API integration needed)');
    } catch (error) {
      console.error('Error saving product:', error);
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
            <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
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
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
             <div className="flex border-b border-gray-200">
    <button
      type="button"
      onClick={() => setActiveTab('general')}
      className={`px-6 py-3 text-sm font-medium ${
        activeTab === 'general'
          ? 'text-gray-900 border-b-2 border-orange-500'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      General
    </button>
    <button
      type="button"
      onClick={() => setActiveTab('advanced')}
      className={`px-6 py-3 text-sm font-medium ${
        activeTab === 'advanced'
          ? 'text-gray-900 border-b-2 border-orange-500'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      Advanced
    </button>
  </div>

            <div className="p-6">
              {/* General Tab Content */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Detail Produk */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detail Produk
                    </label>
                    <textarea
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      placeholder="Isi Detail Produk Anda membahas tentang barang Anda lebih dan mengutamakan kejelasan yang detil tentang, produk yang Anda realisasikan atau buat. Dan lanjutkan penjualan barang dengan menanyakan kepada pelanggan tentang detail-detail yang perlu ditanya."
                      rows={6}
                      className="w-full p-4 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>

              {/* Jenis Produk & Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Produk
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    placeholder="Tentukan Jenis"
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={productData.model}
                    onChange={handleInputChange}
                    placeholder="Model"
                    className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Ukuran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ukuran
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={productData.dimensions}
                  onChange={handleInputChange}
                  placeholder="Panjang x Lebar x Tinggi"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Informasi Tambahan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informasi Tambahan
                </label>
                <textarea
                  name="additionalInfo"
                  value={productData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Tambahkan informasi tambahan seperti garansi, cara perawatan, atau spesifikasi teknis lainnya yang penting untuk pelanggan ketahui."
                  rows={4}
                  className="w-full p-4 border border-gray-300 text-gray-600 rounded-lg  focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              
                </div>
              )}

              {/* Advanced Tab Content */}
              {activeTab === 'advanced' && (
                <div className="space-y-8">
                  {/* Product Stock Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Product Stock</h3>
                      <FiInfo className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-6">
                      *Isi stok produk yang sesuai berdasarkan ketersediaan barang atau item atau jenis produk anda.
                    </p>

                    <div className="space-y-4">
                      {productVariants.map((variant, index) => (
                        <div key={variant.id} className="grid grid-cols-2 gap-4">
                          <div>
                            <select
                              value={variant.variant}
                              onChange={(e) => handleVariantChange(variant.id, 'variant', e.target.value)}
                              className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                              <option value={variant.variant}>{variant.variant}</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Jumlah"
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                              className="flex-1 p-3 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            {productVariants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeVariant(variant.id)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addVariant}
                        className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-400 hover:text-orange-600 flex items-center justify-center gap-2"
                      >
                        <FiPlus className="w-4 h-4" />
                        Tambah Stok
                      </button>
                    </div>
                  </div>

                  {/* Reviews Section - No reviews state */}
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FiX className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Tidak ada review untuk produk ini</h4>
                    <p className="text-sm text-gray-600">
                      Beri tahu untuk meminta kepada pelanggan untuk menggunakan fitur ini.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              Simpan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
