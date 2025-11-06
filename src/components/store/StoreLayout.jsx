'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';
import { useAuth } from "@clerk/nextjs"
import axios from "axios"

const StoreLayout = ({ children }) => {

    const { getToken } = useAuth()

    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)

    const fetchIsSeller = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const token = await getToken()
            const { data } = await axios.get(`${baseUrl}/api/store/is-seller`, {headers: { Authorization: `Bearer ${token}` }})
            setIsSeller(data.isSeller)
            setStoreInfo(data.storeInfo)
        } catch (error) {
            console.error("Error fetching isSeller:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIsSeller()
    }, [])

    return loading ? (
        <Loading />
    ) : isSeller ? (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default StoreLayout