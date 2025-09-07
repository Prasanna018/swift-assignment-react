import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { User } from '../types/types'
import { fetchUsers } from '../api/api'
import Loading from '../components/Loading'
import { Link } from 'react-router-dom'






export default function Profile() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState<string | null>(null)


    useEffect(() => {
        setLoading(true)
        fetchUsers()
            .then(list => {
                if (list && list.length > 0) setUser(list[0])
                else setErr('No users returned')
            })
            .catch(e => setErr(String(e)))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <Loading />
    if (err) return <div className="card">{err}</div>
    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-50 max-w-6xl">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center text-gray-600 cursor-pointer" >
                    <Link className='flex items-center justify-center' to={'/'}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span className="text-lg font-medium">Welcome, {user.name}</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-1 py-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-8">
                        {/* Profile Header */}
                        <div className="flex items-start mb-8">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-xl font-semibold text-gray-600">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h1>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    User ID
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                                    {user.id}
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                                    {user.name}
                                </div>
                            </div>

                            {/* Email ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email ID
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                                    {user.email}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                                    {user.address?.street}, {user.address?.city} - {user.address?.zipcode}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="md:col-start-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                                    {user.phone}
                                </div>
                            </div>

                            {/* Hidden fields that maintain your original logic but aren't displayed */}
                            <div className="hidden">
                                <div>{user.username}</div>
                                <div>{user.website}</div>
                                <div>{user.company?.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}