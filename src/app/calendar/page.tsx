"use client"

import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type Booking = {
    id: string
    startTime: string
    endTime: string
    resource: { name: string; type: string }
    status: string
}

export default function CalendarPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/bookings')
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
        return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' })
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Availability Calendar</h2>
                    <p className="text-zinc-500 text-sm">View all current and upcoming bookings.</p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-zinc-100 animate-pulse rounded-lg dark:bg-zinc-900" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="flex items-center gap-6 p-4 bg-white border border-zinc-200 rounded-lg dark:bg-zinc-950 dark:border-zinc-800"
                        >
                            <div className="flex flex-col items-center justify-center p-3 bg-zinc-50 rounded-md min-w-[80px] dark:bg-zinc-900">
                                <span className="text-[10px] uppercase font-bold text-zinc-400">
                                    {new Date(booking.startTime).toLocaleDateString([], { weekday: 'short' })}
                                </span>
                                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    {new Date(booking.startTime).getDate()}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{booking.resource.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                                        <Clock className="w-3 h-3" />
                                        {getTimeLabel(booking.startTime)} - {getTimeLabel(booking.endTime)}
                                    </div>
                                    <span className="text-zinc-300 dark:text-zinc-800">|</span>
                                    <span className="text-xs text-zinc-500">{booking.resource.type}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    booking.status === 'Approved' ? "bg-green-500" :
                                        booking.status === 'Pending' ? "bg-yellow-500" : "bg-red-500"
                                )} />
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{booking.status}</span>
                            </div>
                        </div>
                    ))}

                    {bookings.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-xl dark:border-zinc-900">
                            <CalendarIcon className="w-8 h-8 text-zinc-200 mx-auto mb-4" />
                            <p className="text-zinc-400 text-sm">No scheduled bookings found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
