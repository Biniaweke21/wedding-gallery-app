'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Photo {
  id: string
  url: string
}

interface GuestPhotoGridProps {
  photos: Photo[]
}

export default function GuestPhotoGrid({ photos }: GuestPhotoGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-300 hover:scale-[1.02] transition-transform duration-200"
          >
            {/* Skeleton */}
            {!loaded[photo.id] && (
              <div className="absolute inset-0 bg-amber-100 animate-pulse rounded-xl" />
            )}
            <img
              src={photo.url}
              alt={`Wedding photo ${index + 1}`}
              loading="lazy"
              decoding="async"
              ref={(el) => { if (el?.complete) setLoaded((prev) => ({ ...prev, [photo.id]: true })) }}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                loaded[photo.id] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setLoaded((prev) => ({ ...prev, [photo.id]: true }))}
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={photos[selectedIndex].url}
              alt={`Full size photo ${selectedIndex + 1}`}
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-lg text-white text-sm">
                  {selectedIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
