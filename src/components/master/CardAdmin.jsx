'use client'
import { useAuth } from '@clerk/nextjs';
import { 
  FiUsers, 
  FiShoppingCart,
  FiShoppingBag,
  FiPackage,
} from 'react-icons/fi';
import Loading from '../Loading';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CardAdmin({ selectedPeriod = '7 hari' }) {

    const {getToken} = useAuth()

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        orders: 0,
        stores: 0,
        users: 0,
    })

    const masterStats = [
        {
          title: 'Total Orders',
          value: dashboardData.orders,
          icon: FiShoppingCart,
          color: 'bg-blue-500',
        },
        {
          title: 'All Products',
          value: dashboardData.products,
          icon: FiPackage,
          color: 'bg-green-500',
        },
        {
          title: 'Total Stores',
          value: dashboardData.stores,
          icon: FiShoppingBag,
          color: 'bg-purple-500',
        },
        {
          title: 'Total New Users',
          value: dashboardData.users,
          icon: FiUsers,
          color: 'bg-orange-500',
        }
      ];

    const fetchDashboardData = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const token = await getToken()
            const {data} = selectedPeriod === 'Semua' ? await axios.get(`${baseUrl}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            }) : await axios.get(`${baseUrl}/api/admin/dashboard?period=${encodeURIComponent(selectedPeriod)}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log(data)
            // Update dengan data dari API - Total Products mengambil semua produk
            setDashboardData({
                products: data?.totalProducts || 0,
                orders: data?.totalOrders || 0,
                stores: data?.totalStores || 0,
                users: data?.totalUsers || 0,
            })
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        // refetch when selectedPeriod changes
        setLoading(true)
        fetchDashboardData()
    }, [selectedPeriod])

    if (loading) return <Loading />

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {masterStats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                        <div className={`${stat.color} p-2 rounded-md w-10 h-10 flex items-center justify-center mb-3`}>
                            <stat.icon className="text-white" size={16} />
                        </div>
                            <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        
    )
}
