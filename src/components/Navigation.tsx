"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Calendar, BookmarkCheck, Settings } from 'lucide-react'

const navItems = [
    { name: 'Resources', href: '/', icon: LayoutDashboard },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'My Bookings', href: '/bookings', icon: BookmarkCheck },
    { name: 'Admin', href: '/admin', icon: Settings },
]

export default function Navigation() {
    const pathname = usePathname()

    return (
        <nav className="flex space-x-1 bg-zinc-100 p-1 rounded-lg mb-8 dark:bg-zinc-900 max-w-fit">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                            isActive
                                ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white"
                                : "text-zinc-600 hover:text-black hover:bg-zinc-200/50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/50"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                    </Link>
                )
            })}
        </nav>
    )
}
