 'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import Link from 'next/link';
import { 
  FiUsers, 
  FiShoppingCart, 
  FiFilter,
  FiCalendar,
  FiExternalLink,
  FiShoppingBag,
  FiStar,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiTruck,
  FiPackage,
} from 'react-icons/fi';
import CardAdmin from '@/components/master/CardAdmin';

export default function MasterDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7 hari');
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    // fetch recent orders from besukma admin API
    const fetchOrders = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = await getToken();
        const { data } = await axios.get(`${baseUrl}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // ensure newest orders first (backend already sorts, but sort again defensively)
        const orders = (data?.orders || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentOrders(orders.slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch recent orders', err);
        setRecentOrders([]);
      }
    }

    // no dummy chat data — leave recentChats empty or fetch real data later
    setRecentChats([]);

    // fetch recent reports from besukma admin API
    const fetchReports = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = await getToken();
        const { data } = await axios.get(`${baseUrl}/api/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // API returns { reports: [...] }
        setRecentReports(data?.reports?.slice(0, 5) || []);
      } catch (err) {
        // on error return empty list (no dummy data)
        setRecentReports([]);
        console.error('Failed to fetch recent reports', err);
      }
    }

    fetchReports();

    // removed dummy services; no-op for recentServices

    // start fetching orders and reports
    fetchOrders();
  }, []);

  // bestProducts area repurposed to show recent user reports (fetched from API)

  const getStatusColor = (status) => {
    const s = (status || '').toString().toUpperCase();
    switch (s) {
      case 'NEW': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getReportStatusIcon = (status) => {
    switch (status) {
      case 'NEW':
        return <FiAlertCircle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <FiClock className="h-4 w-4" />;
      case 'RESOLVED':
        return <FiCheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <FiXCircle className="h-4 w-4" />;
      default:
        return <FiFileText className="h-4 w-4" />;
    }
  };

  // Order status color mapping for recent orders list
  const getOrderStatusClass = (status) => {
    const s = (status || '').toString().toUpperCase();
    switch (s) {
      case 'ORDER_PLACED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'ORDER_PLACED':
        return <FiClock className="h-4 w-4" />;
      case 'PROCESSING':
        return <FiPackage className="h-4 w-4" />;
      case 'SHIPPED':
        return <FiTruck className="h-4 w-4" />;
      case 'DELIVERED':
        return <FiCheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <FiXCircle className="h-4 w-4" />;
      default:
        return <FiShoppingCart className="h-4 w-4" />;
    }
  };

  // Chart data
  const chartData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 75 },
    { day: 'Wed', value: 55 },
    { day: 'Thu', value: 85 },
    { day: 'Fri', value: 70 },
    { day: 'Sat', value: 90 },
    { day: 'Sun', value: 80 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Dashboard</h1>
          <p className="text-gray-600">Master control panel overview and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center px-3 py-2 border border-gray-600 text-gray-600 rounded-lg text-sm">
            <FiCalendar className="mr-2" />
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="7 hari">7 hari</option>
              <option value="1 bulan">1 bulan</option>
              <option value="3 bulan">3 bulan</option>
              <option value="6 bulan">6 bulan</option>
              <option value="1 tahun">1 tahun</option>
            </select>
          </div>
        </div>
      </div>

  <CardAdmin selectedPeriod={selectedPeriod} />

      {/* (Top) removed: Recent User Reports moved into Best Product Sale area below */}

      {/* Recent User Reports (uses Best Product Sale space) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent User Reports</h3>
          <Link href="/master/reports" className="text-slate-600 hover:text-slate-700 text-sm">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentReports.length === 0 && (
            <div className="text-sm text-gray-500">No recent reports.</div>
          )}

          {recentReports.map((report) => (
            <div key={report.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm flex items-center">
                    {report.subject || report.title || `Report #${report.id}`}
                    <FiExternalLink className="ml-2 text-gray-400" size={12} />
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{report.message || '-'}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{report.reporter?.name || '-'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">{report.submittedAt ? new Date(report.submittedAt).toLocaleString() : ''}</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {getReportStatusIcon(report.status)}
                      <span className="ml-1">{report.status.toLowerCase()}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid - Recent Orders (full width) */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link href="/master/orders" className="text-slate-600 hover:text-slate-700 text-sm">
                View All
              </Link>
            </div>
          </div>
          
          {/* Table Headers */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-7 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
              <span>No</span>
              <span>Product</span>
              <span>Product Name</span>
              <span>Quantity</span>
              <span>Total Price</span>
              <span>Buyer Name</span>
              <span>Status</span>
            </div>
          </div>
          
          {/* Table Content */}
          <div className="p-6">
            <div className="space-y-3">
              {recentOrders.length === 0 && (
                <div className="text-sm text-gray-500">No recent orders.</div>
              )}

              {recentOrders.map((order, idx) => {
                const firstItem = order.orderItems && order.orderItems[0];
                const productId = firstItem?.product?.id || '-';
                const productName = firstItem?.product?.name || firstItem?.product?.title || '-';
                const quantity = (order.orderItems || []).reduce((a, it) => a + (it.quantity || 0), 0);
                const total = order.total || 0;
                const buyer = order.user?.name || order.user?.email || '-';
                const status = order.status || (order.paymentStatus || 'UNKNOWN');
                return (
                  <div key={order.id || idx} className="grid grid-cols-7 gap-4 text-sm py-3 border-b border-gray-100 items-center">
                    <span className="text-gray-900">{idx + 1}</span>
                    <span className="text-gray-600">{productId}</span>
                    <span className="text-gray-900">{productName}</span>
                    <span className="text-gray-600">{quantity}</span>
                    <span className="text-gray-900 font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
                    <span className="text-gray-600">{buyer}</span>
                    <span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusClass(status)}`}>
                        {getOrderStatusIcon(status)}
                        <span className="ml-1">{status.toLowerCase()}</span>
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
