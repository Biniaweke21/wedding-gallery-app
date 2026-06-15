'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Photo {
  id: number
  url: string
}

interface PhotoGalleryLightboxProps {
  photos: Photo[]
}

export function PhotoGalleryLightbox({ photos }: PhotoGalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

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
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              src={photo.url}
              alt={`Gallery photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
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

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={photos[selectedIndex].url}
              alt={`Full size photo ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Navigation Buttons */}
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
              </>
            )}

            {/* Counter */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-lg text-white text-sm">
                {selectedIndex + 1} / {photos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
