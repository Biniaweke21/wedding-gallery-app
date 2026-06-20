'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null)
  const [showHint, setShowHint] = useState(false)
  const hintShown = useRef(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  useEffect(() => {
    const imgs = document.querySelectorAll('img[data-photo-id]')
    imgs.forEach((img) => {
      const htmlImg = img as HTMLImageElement
      if (htmlImg.complete) {
        const id = htmlImg.dataset.photoId
        if (id) setLoaded((prev) => prev[id] ? prev : { ...prev, [id]: true })
      }
    })
  }, [])

  useEffect(() => {
    if (selectedIndex !== null && photos.length > 1 && !hintShown.current) {
      hintShown.current = true
      setShowHint(true)
      setTimeout(() => setShowHint(false), 2000)
    }
  }, [selectedIndex !== null])

  const goNext = () => {
    if (selectedIndex === null) return
    setSlideDir('left')
    setTimeout(() => setSlideDir(null), 250)
    setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1)
  }

  const goPrev = () => {
    if (selectedIndex === null) return
    setSlideDir('right')
    setTimeout(() => setSlideDir(null), 250)
    setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1)
  }

  const handlePrev = (e: React.MouseEvent) => { e.stopPropagation(); goPrev() }
  const handleNext = (e: React.MouseEvent) => { e.stopPropagation(); goNext() }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation()
    if (touchStartX.current === null || touchEndX.current === null) return
    const delta = touchStartX.current - touchEndX.current
    if (Math.abs(delta) > 50) {
      delta > 0 ? goNext() : goPrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const slideStyle = slideDir === 'left'
    ? { transform: 'translateX(-8px)', opacity: 0.7, transition: 'transform 250ms ease-out, opacity 250ms ease-out' }
    : slideDir === 'right'
    ? { transform: 'translateX(8px)', opacity: 0.7, transition: 'transform 250ms ease-out, opacity 250ms ease-out' }
    : { transform: 'translateX(0)', opacity: 1, transition: 'transform 250ms ease-out, opacity 250ms ease-out' }

  return (
    <>
      <div className="columns-1 sm:columns-3 gap-2 sm:gap-3 [&>*]:mb-2 sm:[&>*]:mb-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setSelectedIndex(index)}
            className="relative w-full break-inside-avoid rounded-lg overflow-hidden shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-300 hover:scale-[1.015] active:scale-[0.98] transition-all duration-150"
          >
            {!loaded[photo.id] && (
              <div className="w-full h-48 bg-amber-100 animate-pulse rounded-lg" />
            )}
            <img
              src={photo.url}
              alt={`Wedding photo ${index + 1}`}
              loading="lazy"
              decoding="async"
              data-photo-id={photo.id}
              className={`w-full h-auto max-h-[480px] object-cover sm:max-h-none transition-opacity duration-500 ${
                loaded[photo.id] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setLoaded((prev) => ({ ...prev, [photo.id]: true }))}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(26,20,16,0.15), transparent)' }}
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(26, 20, 16, 0.97)' }}
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top gradient */}
          <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)' }} />

          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(null) }}
            className="absolute top-4 right-4 p-3 text-white bg-white/10 backdrop-blur-sm rounded-full transition-colors hover:bg-white/20 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo */}
          <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selectedIndex].url}
              alt={`Full size photo ${selectedIndex + 1}`}
              loading="lazy"
              decoding="async"
              style={slideStyle}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 hidden sm:flex p-2 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 hidden sm:flex p-2 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />

          {/* Counter */}
          {photos.length > 1 && (
            <div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {selectedIndex + 1} / {photos.length}
            </div>
          )}

          {/* Swipe hint */}
          {showHint && (
            <div
              className="absolute bottom-14 left-1/2 -translate-x-1/2 text-white/70 text-xs pointer-events-none transition-opacity duration-500"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Swipe to browse
            </div>
          )}
        </div>
      )}
    </>
  )
}
