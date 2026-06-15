'use client'

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

export default function GalleryList({ galleries }: GalleryListProps) {
  return (
    <div className="grid gap-4">
      {galleries.map((gallery) => (
        <GalleryCard
          key={gallery.id}
          gallery={gallery}
          onDelete={() => {}}
        />
      ))}
    </div>
  )
}
