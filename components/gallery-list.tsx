'use client'

import { useState } from 'react'
import { GalleryCard } from '@/components/gallery-card'

interface Gallery {
  id: string
  slug: string
  couple: string
  date: string
  status: 'Active' | 'Expired'
  viewCount: number
  commentCount: number
  expiresAt: string
}

interface GalleryListProps {
  galleries: Gallery[]
}

export default function GalleryList({ galleries: initial }: GalleryListProps) {
  const [galleries, setGalleries] = useState(initial)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery and all its photos? This cannot be undone.')) return

    const res = await fetch(`/api/galleries/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error ?? 'Failed to delete gallery')
      return
    }

    setGalleries((prev) => prev.filter((g) => g.id !== id))
  }

  return (
    <div className="grid gap-4">
      {galleries.map((gallery) => (
        <GalleryCard
          key={gallery.id}
          gallery={gallery}
          onDelete={() => handleDelete(gallery.id)}
        />
      ))}
    </div>
  )
}
