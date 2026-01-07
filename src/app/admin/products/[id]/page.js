'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiBox
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rp. ';

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      const response = await axios.get(`${baseUrl}/api/store/product/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProduct(response.data.product);
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to fetch product');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeleting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = await getToken();
      await axios.delete(`${baseUrl}/api/store/product/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Product deleted successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to delete product');
      console.error('Error deleting product:', error);
    } finally {
      setDeleting(false);
    }
  };

  const calculateDiscount = () => {
    if (product?.mrp && product?.price && product.mrp > product.price) {
      return Math.round(((product.mrp - product.price) / product.mrp) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
        <Link href="/admin/products" className="text-orange-600 hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">Product Details</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/products/edit/${product.id}`}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <FiEdit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
          >
            <FiTrash2 className="w-4 h-4" />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Images */}
        <div className="lg:col-span-1 space-y-4">
          {/* Main Image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-3">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg"
                  unoptimized
                />
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1).map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        alt={`${product.name} ${idx + 2}`}
                        width={100}
                        height={100}
                        className="w-full h-20 object-cover rounded border"
                        unoptimized
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No images</p>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.status === 'published' ? 'bg-green-500' :
                  product.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
              <span className="text-sm text-gray-700 capitalize">{product.status}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {product.categoriesDetails && product.categoriesDetails.length > 0 ? (
                product.categoriesDetails.map((cat, idx) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-700">
                      {cat.name}
                      {idx === 0 && <span className="ml-2 text-xs text-gray-500">(Primary)</span>}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No categories</p>
              )}
            </div>
          </div>
        </div>

        {/* Right - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{product.description || '-'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {product.mrp && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Actual Price</label>
                    <p className="text-gray-900 mt-1">{currency}{product.mrp.toLocaleString('id-ID')}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Offer Price</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-900 font-semibold">{currency}{product.price.toLocaleString('id-ID')}</p>
                    {discount > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {product.weight && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Weight</label>
                    <p className="text-gray-900 mt-1">{product.weight}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dimensions</label>
                    <p className="text-gray-900 mt-1">{product.dimensions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Models/Variants */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Models</h3>
              <div className="text-sm text-gray-600">
                Total Stock: <span className="font-semibold text-gray-900">{product.stock}</span> units
              </div>
            </div>
            <div className="space-y-3">
              {product.variants && product.variants.length > 0 ? (
                product.variants.map((variant, idx) => (
                  <div key={variant.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{variant.variant}</p>
                        <p className="text-xs text-gray-500">Model {idx + 1}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{variant.stock} units</p>
                      <p className="text-xs text-gray-500">In stock</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No models available</p>
              )}
            </div>
          </div>

          {/* Stock Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiBox className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Total Stock</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">{product.stock}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiPackage className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-900">Models</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{product.variants?.length || 0}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-medium text-purple-900">Price</p>
              </div>
              <p className="text-xl font-bold text-purple-900">{currency}{product.price.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}