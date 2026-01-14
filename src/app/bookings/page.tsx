"use client"

import { useState, useEffect } from 'react'
import { BookmarkCheck, Clock, MapPin, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Booking = {
    id: string
    startTime: string
    endTime: string
    purpose: string
    status: string
    resource: { name: string; type: string; location: string | null }
}

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Mocking userId for now
        fetch('/api/bookings?userId=user-123')
            .then((res) => res.json())
            .then((data) => {
                setBookings(data)
                setLoading(false)
            })
    }, [])

    const getTimeLabel = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const getDateLabel = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold">My Bookings</h2>
                <p className="text-zinc-500 text-sm">Track and manage your resource reservations.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-32 bg-zinc-100 animate-pulse rounded-lg dark:bg-zinc-900" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="group p-6 bg-white border border-zinc-200 rounded-lg dark:bg-zinc-950 dark:border-zinc-800"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                            booking.status === 'Approved' ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:border-green-900/30" :
                                                booking.status === 'Pending' ? "bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800" :
                                                    "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:border-red-900/30"
                                        )}>
                                            {booking.status}
                                        </span>
                                        <span className="text-xs text-zinc-400">{booking.resource.type}</span>
                                    </div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{booking.resource.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        <div className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
                                            <Clock className="w-3 h-3" />
                                            {getDateLabel(booking.startTime)}
                                        </div>
                                        <span>•</span>
                                        <div>{getTimeLabel(booking.startTime)} - {getTimeLabel(booking.endTime)}</div>
                                    </div>
                                    {booking.resource.location && (
                                        <div className="flex items-center gap-1 text-xs text-zinc-500 pt-1">
                                            <MapPin className="w-3 h-3" />
                                            {booking.resource.location}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-zinc-50 rounded-lg md:max-w-xs w-full dark:bg-zinc-900/50">
                                    <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Purpose</p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 italic">"{booking.purpose}"</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {bookings.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-xl dark:border-zinc-900">
                            <BookmarkCheck className="w-8 h-8 text-zinc-200 mx-auto mb-4" />
                            <p className="text-zinc-400 text-sm">You haven't made any bookings yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
