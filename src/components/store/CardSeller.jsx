'use client'
import { useAuth } from '@clerk/nextjs';
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

export default function CardSeller() {

    const {getToken} = useAuth()

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rp. '

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    // const dashboardCardsData = [
    //     { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
    //     { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
    //     { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
    //     { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    // ]

    const stats = [
        { title: 'Total Revenue', value: currency + dashboardData.revenue, change: '+20.1%', isPositive: true, icon: FiDollarSign, color: 'bg-green-500' },
        { title: 'Total Orders', value: dashboardData.orders, change: '+12.5%', isPositive: true, icon: FiShoppingCart, color: 'bg-blue-500' },
        { title: 'Total Products', value: dashboardData.products, change: '+5.3%', isPositive: true, icon: FiTrendingUp, color: 'bg-purple-500' },
        { title: 'Total Customers', value: '890', change: '+8.7%', isPositive: true, icon: FiUsers, color: 'bg-orange-500' }
    ]

    const fetchDashboardData = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const token = await getToken()
            const {data} = await axios.get(`${baseUrl}/api/admin/dashboard`, {
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
    }, [])

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
