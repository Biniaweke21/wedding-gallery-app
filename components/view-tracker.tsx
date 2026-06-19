'use client'

import { useEffect } from 'react'

export default function ViewTracker({ galleryId }: { galleryId: string }) {
  useEffect(() => {
    fetch(`/api/galleries/${galleryId}/view`, { method: 'POST' })
  }, [])

  return null
}
