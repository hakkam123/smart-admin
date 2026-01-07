'use client'
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import {
    FiTrendingUp,
    FiUsers,
    FiShoppingCart,
    FiDollarSign,
    FiArrowUp,
    FiArrowDown,
} from 'react-icons/fi';
import Loading from '../Loading';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CardSeller({ period }) {

    const { getToken } = useAuth()

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rp. '

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    })

    const stats = [
        { title: 'Total Revenue', value: currency + dashboardData.totalEarnings, change: '+20.1%', isPositive: true, icon: FiDollarSign, color: 'bg-green-500' },
        { title: 'Total Orders', value: dashboardData.totalOrders, change: '+12.5%', isPositive: true, icon: FiShoppingCart, color: 'bg-blue-500' },
        { title: 'Total Products', value: dashboardData.totalProducts, change: '+5.3%', isPositive: true, icon: FiTrendingUp, color: 'bg-purple-500' },
        { title: 'Total Rating', value: dashboardData.ratings.length, change: '+8.7%', isPositive: true, icon: FiUsers, color: 'bg-orange-500' }
    ]

    // Mapping periode dari bahasa Indonesia ke format API
    const periodMapping = {
        '7 hari': '7d',
        '1 bulan': '1m',
        '3 bulan': '3m',
        '6 bulan': '6m',
        '1 tahun': '1y'
    }

    const fetchDashboardData = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = await getToken()

            // Buat URL dengan parameter period jika ada
            let url = `${baseUrl}/api/store/dashboard`;
            if (period && periodMapping[period]) {
                url += `?period=${periodMapping[period]}`;
            }

            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setDashboardData(data.dashboardData)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [period])

    if (loading) return <Loading />

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            {/* <div className="flex items-center mt-2">
                        {stat.isPositive ? (
                        <FiArrowUp className="text-green-500 mr-1" size={16} />
                        ) : (
                        <FiArrowDown className="text-red-500 mr-1" size={16} />
                        )}
                        <span className={`text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">vs last month</span>
                    </div> */}
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                            <stat.icon className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
