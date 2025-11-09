'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import Sidebar from '@/components/msidebar/MSidebar';
import Header from '@/components/header/Header';
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"

const MasterLayoutTemplate = ({ children }) => {

    const {user} = useUser()
    const { getToken } = useAuth()

    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchIsAdmin = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const token = await getToken();
            const {data} = await axios.get(`${baseUrl}/api/admin/is-admin`, {headers: {Authorization: `Bearer ${token}`}})
            setIsAdmin(data.isAdmin)
        } catch (error) {
            console.error("Error fetching admin status:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(user){
            fetchIsAdmin()
        }
    }, [user])

    return loading ? (
        <Loading />
    ) : isAdmin ? (
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
            <Link href="/master" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default MasterLayoutTemplate