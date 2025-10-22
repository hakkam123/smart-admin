'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiSearch, 
  FiFilter, 
  FiGrid,
  FiList,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye
} from 'react-icons/fi';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Laptop Gaming ASUS ROG',
      category: 'Electronics',
      price: 15000000,
      stock: 25,
      image: '/api/placeholder/300/200',
      status: 'active',
      description: 'Laptop gaming dengan performa tinggi untuk gaming dan editing'
    },
    {
      id: 2,
      name: 'Smartphone Samsung Galaxy',
      category: 'Electronics',
      price: 8500000,
      stock: 12,
      image: '/api/placeholder/300/200',
      status: 'active',
      description: 'Smartphone flagship dengan kamera terbaik di kelasnya'
    },
    {
      id: 3,
      name: 'Headphones Sony WH-1000XM4',
      category: 'Electronics',
      price: 1200000,
      stock: 8,
      image: '/api/placeholder/300/200',
      status: 'active',
      description: 'Headphones wireless dengan noise cancellation terbaik'
    },
    {
      id: 4,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 750000,
      stock: 15,
      image: '/api/placeholder/300/200',
      status: 'active',
      description: 'Keyboard mechanical untuk gaming dan productivity'
    },
    {
      id: 5,
      name: 'Monitor 4K Dell',
      category: 'Electronics',
      price: 3200000,
      stock: 6,
      image: '/api/placeholder/300/200',
      status: 'active',
      description: 'Monitor 4K 27 inch untuk professional dan gaming'
    },
    {
      id: 6,
      name: 'Mouse Gaming Logitech',
      category: 'Accessories',
      price: 450000,
      stock: 20,
      image: '/api/placeholder/300/200',
      status: 'active',
      description: 'Mouse gaming dengan sensor presisi tinggi'
    }
  ];

  const categories = ['all', 'Electronics', 'Accessories', 'Clothing', 'Books'];
  const priceRanges = [
    { label: 'Semua Harga', value: 'all' },
    { label: 'Di bawah Rp 500K', value: '0-500000' },
    { label: 'Rp 500K - 1Jt', value: '500000-1000000' },
    { label: 'Rp 1Jt - 5Jt', value: '1000000-5000000' },
    { label: 'Di atas Rp 5Jt', value: '5000000-999999999' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredProducts = products.filter(product => {
    let matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    let matchesPrice = true;
    
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      matchesPrice = product.price >= min && product.price <= max;
    }
    
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Information</h1>
              <p className="text-gray-600">Manage product details</p>
            </div>
          </div>
            <div>
            <h1 className="text-2xl font-bold text-gray-900"></h1>
            <p className="text-gray-600"></p>
            </div>
            <Link 
            href="/admin/products/add"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 flex items-center gap-2 transition-colors"
            >
            <FiPlus className="w-4 h-4" />
            Tambah Produk
            </Link>
        </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter</h3>
          
          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {category === 'all' ? 'Semua Kategori' : category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Harga</label>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <label key={range.value} className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={priceRange === range.value}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Menampilkan {filteredProducts.length} dari {products.length} produk
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div> */}

          {/* Products Grid */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/admin/products/${product.id}`} className="block">
                  {/* Product Image */}
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-sm">Product Image</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-orange-600">{formatPrice(product.price)}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FiFilter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more products.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
