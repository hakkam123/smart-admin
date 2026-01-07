'use client'
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';
import Link from 'next/link';

export default function BestProducts() {
  const { getToken } = useAuth();
  const [bestProducts, setBestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rp. ';

  const fetchBestProducts = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = await getToken();

      const { data } = await axios.get(`${baseUrl}/api/store/best-products?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBestProducts(data.bestProducts || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBestProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Best Product Sales</h3>
          <Link href="/admin/products" className="text-orange-600 hover:text-orange-700 text-sm">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse p-3 border border-gray-100 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bestProducts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Best Product Sales</h3>
          <Link href="/admin/products" className="text-orange-600 hover:text-orange-700 text-sm">
            View All
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          Belum ada produk yang terjual
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Best Product Sales</h3>
        <Link href="/admin/products" className="text-orange-600 hover:text-orange-700 text-sm">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {bestProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center flex-1 gap-3">
              {/* Product Image */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                    #{index + 1}
                  </span>
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                    {product.name}
                  </h4>
                </div>

                <div className="flex items-center mt-1">
                  {product.averageRating > 0 && (
                    <>
                      <FiStar className="text-yellow-400 mr-1" size={14} />
                      <span className="text-xs text-gray-600">{product.averageRating}</span>
                      <span className="text-xs text-gray-400 mx-2">•</span>
                    </>
                  )}
                  <span className="text-xs text-gray-600">{product.totalSold} sold</span>
                </div>

                <p className="text-sm font-medium text-gray-900 mt-1">
                  {currency}{product.totalRevenue.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
