'use client'

import Link from 'next/link'
import { Eye, MessageCircle, Trash2 } from 'lucide-react'

interface Gallery {
  id: string
  couple: string
  date: string
  status: 'Active' | 'Expired'
  viewCount: number
  commentCount: number
  slug: string
  expiresAt: string
}

interface GalleryCardProps {
  gallery: Gallery
  onDelete: () => void
}

export function GalleryCard({ gallery, onDelete }: GalleryCardProps) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 transition-colors"
      style={{ borderBottom: '1px solid var(--color-sand)', backgroundColor: '#ffffff' }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fdf8f2')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
    >
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium truncate" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
          {gallery.couple}
        </p>
        <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
          {new Date(gallery.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="w-20 flex justify-center">
        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={gallery.status === 'Active'
            ? { backgroundColor: '#ecfdf5', color: '#27ae60' }
            : { backgroundColor: '#f3f4f6', color: '#6b7280' }}
        >
          {gallery.status}
        </span>
      </div>

      <div className="w-16 flex items-center justify-end gap-1.5" style={{ color: '#a0856c' }}>
        <Eye className="w-3.5 h-3.5 shrink-0" />
        <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>{gallery.viewCount}</span>
      </div>

      <div className="w-16 flex items-center justify-end gap-1.5" style={{ color: '#a0856c' }}>
        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
        <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>{gallery.commentCount}</span>
      </div>

      <div className="flex items-center gap-2 ml-2">
        <Link href={`/admin/galleries/${gallery.slug}`}>
          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-amber-50" style={{ fontFamily: 'var(--font-body)', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}>
            View
          </button>
        </Link>
        <button onClick={onDelete} className="p-1.5 rounded-lg transition-colors hover:bg-red-50" style={{ color: '#c0392b' }} title="Delete gallery">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
