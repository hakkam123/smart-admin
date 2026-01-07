'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CardSeller from '@/components/store/CardSeller';
import RevenueChart from '@/components/store/RevenueChart';
import BestProducts from '@/components/store/BestProducts';
import RecentOrders from '@/components/store/RecentOrders';
import {
  FiFilter,
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiStar
} from 'react-icons/fi';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7 hari');



  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          {/* <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your store today.</p> */}
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

      {/* Stats Cards */}
      <CardSeller period={selectedPeriod} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Analytics Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales Analytics</h3>
              <p className="text-gray-600">Revenue trends for {selectedPeriod}</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-600 text-gray-600 rounded-lg text-sm"
              >
                <option value="7 hari">7 hari</option>
                <option value="1 bulan">1 bulan</option>
                <option value="3 bulan">3 bulan</option>
                <option value="6 bulan">6 bulan</option>
                <option value="1 tahun">1 tahun</option>
              </select>
            </div>
          </div>

          {/* Revenue Chart Component */}
          <RevenueChart period={selectedPeriod} />
        </div>

        {/* Best Product Sales */}
        <BestProducts />
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
}