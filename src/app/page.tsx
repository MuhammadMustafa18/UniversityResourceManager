"use client"

import { useState, useEffect } from 'react'
import { Search, MapPin, Info, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import BookingModal from '@/components/BookingModal'

type Resource = {
  id: string
  name: string
  type: string
  description: string | null
  location: string | null
  status: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/resources')
      .then((res) => res.json())
      .then((data) => {
        setResources(data)
        setLoading(false)
      })
  }, [])

  const filteredResources = resources.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    (r.location?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  const handleBookingSuccess = () => {
    alert('Booking request submitted successfully!')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Resource Catalog</h2>
          <p className="text-zinc-500 text-sm">Find and book labs, halls, or equipment.</p>
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-md text-sm focus:ring-2 focus:ring-zinc-200 outline-none dark:bg-zinc-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-zinc-100 animate-pulse rounded-lg dark:bg-zinc-900" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="group p-6 bg-white border border-zinc-200 rounded-lg hover:border-zinc-300 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-zinc-100 rounded-md dark:bg-zinc-800">
                  <Tag className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                  resource.status === 'Available' ? "bg-zinc-100 text-zinc-900" : "bg-red-50 text-red-600"
                )}>
                  {resource.status}
                </span>
              </div>

              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">{resource.name}</h3>
              <p className="text-xs text-zinc-500 mb-4">{resource.type}</p>

              <div className="space-y-2 mb-6">
                {resource.location && (
                  <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-3 h-3" />
                    {resource.location}
                  </div>
                )}
                {resource.description && (
                  <div className="flex items-start gap-2 text-xs text-zinc-500">
                    <Info className="w-3 h-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{resource.description}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedResource(resource)
                  setIsModalOpen(true)
                }}
                className="w-full py-2 bg-black text-white text-xs font-medium rounded-md hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Book Resource
              </button>
            </div>
          ))}

          {filteredResources.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 rounded-lg dark:border-zinc-800">
              <p className="text-zinc-500 text-sm">No resources found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {selectedResource && (
        <BookingModal
          resource={selectedResource}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}
