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
            Delete Product
          </button>
        </div>
      </div>

      <form className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
              </div>

              <div className="p-6">
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
                  </div>
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
          </div>
        </div>
      </form>
    </div>
  );
}