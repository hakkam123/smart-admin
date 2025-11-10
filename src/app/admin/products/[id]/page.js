'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  FiArrowLeft,
  FiEdit,
  FiShare2,
  FiHeart,
  FiStar,
  FiPackage,
  FiTruck,
  FiShield,
  FiInfo,
  FiEye,
  FiDollarSign
} from 'react-icons/fi';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock product data - in real app, this would come from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProductData = {
        id: params.id,
        name: 'Wireless Bluetooth Headphones Premium',
        description: 'High-quality wireless Bluetooth headphones with noise cancellation feature, comfortable design, and premium sound quality. Perfect for music lovers and professionals.',
        category: 'electronics',
        categoryLabel: 'Electronics',
        price: 299000,
        stock: 45,
        weight: '250g',
        dimensions: '20cm x 18cm x 8cm',
        model: 'WBH-Pro-2024',
        additionalInfo: 'Garansi resmi 1 tahun, battery life hingga 30 jam, fast charging 15 menit untuk 3 jam penggunaan. Kompatibel dengan semua device Bluetooth 5.0 dan dilengkapi dengan carrying case premium.',
        status: 'published',
        // Advanced fields
        sku: 'WBH-001-2024',
        barcode: '1234567890123',
        minStock: 10,
        shippingWeight: '350g',
        shippingLength: '25cm',
        shippingWidth: '20cm',
        shippingHeight: '10cm',
        warranty: '1 Year Official Warranty',
        returnPolicy: '7 days return policy',
        tags: 'wireless, bluetooth, headphones, audio, music',
        metaTitle: 'Premium Wireless Bluetooth Headphones - Best Audio Quality',
        metaDescription: 'Shop premium wireless Bluetooth headphones with noise cancellation. High-quality audio, comfortable design, long battery life.',
        images: [
          { id: 1, url: '/api/placeholder/400/300', isMain: true },
          { id: 2, url: '/api/placeholder/400/300', isMain: false },
          { id: 3, url: '/api/placeholder/400/300', isMain: false },
          { id: 4, url: '/api/placeholder/400/300', isMain: false }
        ],
        variants: [
          { id: 1, variant: 'Black Edition', stock: 15 },
          { id: 2, variant: 'White Edition', stock: 12 },
          { id: 3, variant: 'Silver Edition', stock: 8 },
          { id: 4, variant: 'Rose Gold', stock: 10 }
        ],
        reviews: [
          {
            id: 1,
            customer: 'John Doe',
            rating: 5,
            comment: 'Excellent sound quality and very comfortable to wear.',
            date: '2024-10-20'
          },
          {
            id: 2,
            customer: 'Jane Smith',
            rating: 4,
            comment: 'Good product, fast delivery. Recommended!',
            date: '2024-10-18'
          }
        ],
        statistics: {
          totalSold: 156,
          totalRevenue: 46644000,
          averageRating: 4.7,
          totalReviews: 23
        }
      };
      setProductData(mockProductData);
      setLoading(false);
    }, 1000);
  }, [params.id]);

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

  const mainImage = productData.images.find(img => img.isMain) || productData.images[0];
  const additionalImages = productData.images.filter(img => !img.isMain);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
          </div>
        </div>
      </form>
    </div>
  );
}
