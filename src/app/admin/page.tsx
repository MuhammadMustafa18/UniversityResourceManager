"use client"

import { useState, useEffect } from 'react'
import { Check, X, Pencil, Plus, Trash2, Package, Users, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type Booking = {
    id: string
    startTime: string
    endTime: string
    userName: string
    purpose: string
    status: string
    resource: { name: string; type: string }
}

type Resource = {
    id: string
    name: string
    type: string
    location: string | null
    status: string
}

export default function AdminPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'pending' | 'resources'>('pending')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        const [bookingsRes, resourcesRes] = await Promise.all([
            fetch('/api/bookings'),
            fetch('/api/resources')
        ])
        const bookingsData = await bookingsRes.json()
        const resourcesData = await resourcesRes.json()
        setBookings(bookingsData)
        setResources(resourcesData)
        setLoading(false)
    }

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
            }
        } catch (error) {
            console.error('Failed to update status', error)
        }
    }

    const pendingBookings = bookings.filter(b => b.status === 'Pending')

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Admin Dashboard</h2>
                    <p className="text-zinc-500 text-sm">Review bookings and manage resources.</p>
                </div>

                <div className="flex bg-zinc-100 p-1 rounded-lg dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                            activeTab === 'pending' ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                        )}
                    >
                        Pending ({pendingBookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={cn(
                            "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                            activeTab === 'resources' ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                        )}
                    >
                        Resources
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-zinc-100 animate-pulse rounded-lg dark:bg-zinc-900" />
                    ))}
                </div>
            ) : activeTab === 'pending' ? (
                <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="p-6 bg-white border border-zinc-200 rounded-lg dark:bg-zinc-950 dark:border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{booking.userName}</h3>
                                    <span className="text-xs text-zinc-400">requested</span>
                                    <span className="text-xs font-medium text-black bg-zinc-100 px-2 py-0.5 rounded dark:bg-zinc-800 dark:text-white">
                                        {booking.resource.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(booking.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </div>
                                    <span>•</span>
                                    <div className="italic">"{booking.purpose}"</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-red-600 border border-red-100 bg-red-50 hover:bg-red-100 rounded-md transition-all dark:bg-red-950/20 dark:border-red-900/30 dark:hover:bg-red-950/40"
                                >
                                    <X className="w-3.5 h-3.5" /> Reject
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(booking.id, 'Approved')}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-black hover:bg-zinc-800 rounded-md transition-all dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                            </div>
                        </div>
                    ))}

                    {pendingBookings.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-xl dark:border-zinc-900">
                            <p className="text-zinc-400 text-sm">No pending booking requests.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                            <Plus className="w-3.5 h-3.5" /> Add Resource
                        </button>
                    </div>

                    <div className="border border-zinc-200 rounded-lg overflow-hidden dark:border-zinc-800">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-50 border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-zinc-900 dark:text-zinc-100">Resource Name</th>
                                    <th className="px-6 py-3 font-semibold text-zinc-900 dark:text-zinc-100">Type</th>
                                    <th className="px-6 py-3 font-semibold text-zinc-900 dark:text-zinc-100">Location</th>
                                    <th className="px-6 py-3 font-semibold text-zinc-900 dark:text-zinc-100">Status</th>
                                    <th className="px-6 py-3 font-semibold text-zinc-900 dark:text-zinc-100 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                                {resources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{resource.name}</td>
                                        <td className="px-6 py-4 text-zinc-500">{resource.type}</td>
                                        <td className="px-6 py-4 text-zinc-500">{resource.location || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase",
                                                resource.status === 'Available' ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:border-green-900/30" : "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:border-red-900/30"
                                            )}>
                                                {resource.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 hover:bg-zinc-100 rounded dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="p-1.5 hover:bg-red-50 rounded dark:hover:bg-red-950/40 text-zinc-400 hover:text-red-600">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
