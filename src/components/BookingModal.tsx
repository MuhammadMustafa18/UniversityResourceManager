"use client"

import { useState } from 'react'
import { X, Calendar as CalendarIcon, Clock, User, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

type Resource = {
    id: string
    name: string
    type: string
}

type BookingModalProps = {
    resource: Resource
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function BookingModal({ resource, isOpen, onClose, onSuccess }: BookingModalProps) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        userName: '',
        purpose: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const startTime = new Date(`${formData.date}T${formData.startTime}:00`).toISOString()
        const endTime = new Date(`${formData.date}T${formData.endTime}:00`).toISOString()

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resourceId: resource.id,
                    startTime,
                    endTime,
                    userId: 'user-123', // Mock user for now
                    userName: formData.userName,
                    purpose: formData.purpose,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to book resource')
            }

            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden dark:bg-zinc-950 dark:border dark:border-zinc-800">
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-900">
                    <div>
                        <h3 className="text-lg font-semibold">Book {resource.name}</h3>
                        <p className="text-xs text-zinc-500">{resource.type}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full dark:hover:bg-zinc-900">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 text-xs bg-red-50 text-red-600 rounded-md border border-red-100 dark:bg-red-950/20 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <User className="w-3 h-3" /> Name
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Enter your name"
                                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-black dark:bg-zinc-900 dark:border-zinc-800"
                                value={formData.userName}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <CalendarIcon className="w-3 h-3" /> Date
                            </label>
                            <input
                                required
                                type="date"
                                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-black dark:bg-zinc-900 dark:border-zinc-800"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Start Time
                                </label>
                                <input
                                    required
                                    type="time"
                                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-black dark:bg-zinc-900 dark:border-zinc-800"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> End Time
                                </label>
                                <input
                                    required
                                    type="time"
                                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-black dark:bg-zinc-900 dark:border-zinc-800"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Purpose
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="What is the reservation for?"
                                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-black dark:bg-zinc-900 dark:border-zinc-800 resize-none"
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border border-zinc-200 text-sm font-medium rounded-md hover:bg-zinc-50 transition-colors dark:border-zinc-800 dark:hover:bg-zinc-900"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            className="flex-1 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
