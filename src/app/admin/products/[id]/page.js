'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import {
  FiArrowLeft,
  FiStar,
  FiInfo,
  FiEye,
  FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ProductDetailPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProductData = React.useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      const response = await axios.get(`${baseUrl}/api/store/product/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.product) {
        const product = response.data.product;
        setProductData({
          ...product,
          categoryLabel: product.category?.name || product.category,
          images: product.images?.map((url, index) => ({
            id: index + 1,
            url: url,
            isMain: index === 0
          })) || [],
          variants: product.variants || [],
          reviews: product.reviews || [],
          statistics: {
            totalSold: product.totalSold || 0,
            totalRevenue: product.totalRevenue || 0,
            averageRating: product.averageRating || 0,
            totalReviews: product.totalReviews || 0
          }
        });
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
  }, [getToken, params.id]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
        <Link href="/admin/products" className="text-orange-600 hover:text-orange-700 mt-2 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const mainImage = productData.images.find(img => img.isMain) || (productData.images.length > 0 ? productData.images[0] : null);
  const additionalImages = productData.images.filter(img => !img.isMain);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const deleteProduct = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      const response = await axios.delete(`${baseUrl}/api/store/product/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.message) {
        toast.success('Product deleted successfully');
        router.push('/admin/products'); // Redirect to products list
      } else {
        toast.error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Error deleting product');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-300 text-gray-600 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/products/edit/${params.id}`}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            Edit Product
          </Link>

          <button
            onClick={deleteProduct}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete Product
          </button>
        </div>
      </div>

      <form className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('general')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'general'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('advanced')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'advanced'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Advanced
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* General Tab Content */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                      </label>
                      <p className="text-lg font-semibold text-gray-900">{productData.name}</p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <p className="text-gray-700 leading-relaxed">{productData.description}</p>
                    </div>

                    {/* Category and Price */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <p className="text-gray-900">{productData.categoryLabel}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price
                        </label>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(productData.price)}</p>
                      </div>
                    </div>

                    {/* Stock and Weight */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock
                        </label>
                        <p className="text-gray-900">{productData.stock} units</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight
                        </label>
                        <p className="text-gray-900">{productData.weight}</p>
                      </div>
                    </div>

                    {/* Model and Dimensions */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Model
                        </label>
                        <p className="text-gray-900">{productData.model}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dimensions
                        </label>
                        <p className="text-gray-900">{productData.dimensions}</p>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Information
                      </label>
                      <p className="text-gray-700 leading-relaxed">{productData.additionalInfo}</p>
                    </div>
                  </div>
                )}

                {/* Advanced Tab Content */}
                {activeTab === 'advanced' && (
                  <div className="space-y-8">
                    {/* Product Specifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                          <p className="text-gray-900">{productData.sku}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                          <p className="text-gray-900">{productData.barcode}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                          <p className="text-gray-900">{productData.minStock} units</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
                          <p className="text-gray-900">{productData.warranty}</p>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Weight</label>
                          <p className="text-gray-900">{productData.shippingWeight}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Dimensions</label>
                          <p className="text-gray-900">{productData.shippingLength} x {productData.shippingWidth} x {productData.shippingHeight}</p>
                        </div>
                      </div>
                    </div>

                    {/* Product Variants */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
                        <FiInfo className="w-4 h-4 text-gray-400" />
                      </div>

                      <div className="space-y-3">
                        {productData.variants.map((variant) => (
                          <div key={variant.id} className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Variant</label>
                              <p className="text-gray-900">{variant.variant}</p>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                              <p className="text-gray-900">{variant.stock} units</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                      {productData.reviews.length > 0 ? (
                        <div className="space-y-4">
                          {productData.reviews.map((review) => (
                            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{review.customer}</h4>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <FiStar
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <FiStar className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                          <p className="text-sm text-gray-600">
                            This product hasn&apos;t received any customer reviews yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Sold</span>
                  <span className="font-semibold text-gray-900">{productData.statistics.totalSold}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-semibold text-green-600">{formatCurrency(productData.statistics.totalRevenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Rating</span>
                  <div className="flex items-center gap-1">
                    <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{productData.statistics.averageRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reviews</span>
                  <span className="font-semibold text-gray-900">{productData.statistics.totalReviews}</span>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiEye className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
              </div>

              {/* Main Image Display */}
              <div className="mb-4">
                {mainImage && (
                  <Image
                    src={mainImage.url}
                    alt="Main product"
                    width={300}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    unoptimized
                  />
                )}
              </div>

              {/* Additional Images Grid */}
              {additionalImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {additionalImages.map((image) => (
                    <Image
                      key={image.id}
                      src={image.url}
                      alt={`Product ${image.id}`}
                      width={64}
                      height={64}
                      className="w-full h-16 object-cover rounded border border-gray-200"
                      unoptimized
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publication Status
                  </label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    productData.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {productData.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    productData.stock > productData.minStock
                      ? 'bg-green-100 text-green-800'
                      : productData.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {productData.stock > productData.minStock
                      ? 'In Stock'
                      : productData.stock > 0
                      ? 'Low Stock'
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* SEO Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <p className="text-sm text-gray-900">{productData.metaTitle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <p className="text-sm text-gray-700">{productData.metaDescription}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {productData.tags && productData.tags !== '' ?
                      productData.tags.split(', ').map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      )) :
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                        No tags
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}