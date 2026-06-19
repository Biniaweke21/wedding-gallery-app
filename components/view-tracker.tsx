'use client'

import { useEffect, useRef } from 'react'

export default function ViewTracker({ galleryId }: { galleryId: string }) {
  const hasFired = useRef(false)

  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true
    fetch(`/api/galleries/${galleryId}/view`, { method: 'POST' })
  }, [galleryId])

  return null
}
