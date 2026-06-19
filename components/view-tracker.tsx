'use client'

import { useEffect, useRef } from 'react'

export default function ViewTracker({ galleryId, viewToken }: { galleryId: string; viewToken: string }) {
  const hasFired = useRef(false)

  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true
    fetch(`/api/galleries/${galleryId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ viewToken }),
    })
  }, [galleryId, viewToken])

  return null
}
