'use client'
import { useAuth } from '@clerk/nextjs';
import Loading from '../Loading';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiMessageCircle, FiExternalLink } from 'react-icons/fi';
import axios from 'axios';
import Image from 'next/image';

export default function CustomerRelationship() {

    const {getToken} = useAuth()

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        ratings: [],
    })

    const fetchDashboardData = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const token = await getToken()
            const {data} = await axios.get(`${baseUrl}/api/store/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setDashboardData(data.dashboardData)
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Relationship</h3>
            <Link 
              href="/admin/messages" 
              className="text-orange-600 hover:text-orange-700 text-sm flex items-center"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData.ratings.map((chat, index) => (
              <Link 
                key={index} 
                href={`/admin/messages?chat=${index}`}
                className="block p-4 border border-gray-100 rounded-lg hover:border-orange-200 hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{chat.user.name}</span>
                      <div className="flex items-center">
                        <Image src={chat.user.image} alt="" className="w-10 aspect-square rounded-full" width={100} height={100} />
                      </div>
                      {/* {chat.unread > 0 && (
                        <div className="flex items-center">
                          <FiBell className="text-orange-600 mr-1" size={14} />
                          <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                            {chat.unread}
                          </span>
                        </div>
                      )} */}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{chat.review}</p>
                    <div className="flex items-center mt-2">
                      <FiMessageCircle className="text-gray-400 mr-1" size={12} />
                      <span className="text-xs text-gray-500">{new Date(chat.createdAt).toDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
    )
}
