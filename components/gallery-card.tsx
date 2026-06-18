'use client'

import Link from 'next/link'
import { Eye, MessageCircle, Trash2, ExternalLink } from 'lucide-react'

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
      className="rounded-xl shadow-sm p-5 flex items-center justify-between gap-4"
      style={{ backgroundColor: '#ffffff', border: '1px solid #e8d5b0' }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h3 className="text-xl font-serif font-bold" style={{ color: '#2c1810' }}>
            {gallery.couple}
          </h3>
          <span
            className="px-3 py-0.5 rounded-full text-xs font-medium"
            style={
              gallery.status === 'Active'
                ? { backgroundColor: '#ecfdf5', color: '#27ae60' }
                : { backgroundColor: '#f3f4f6', color: '#6b7280' }
            }
          >
            {gallery.status}
          </span>
        </div>
        <p className="text-sm mb-3" style={{ color: '#a0856c' }}>
          {new Date(gallery.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <div className="flex gap-5 text-sm" style={{ color: '#a0856c' }}>
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            {gallery.viewCount}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            {gallery.commentCount}
          </span>
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <Link href={`/admin/galleries/${gallery.slug}`}>
          <button
            className="px-4 py-1.5 rounded-full text-sm font-medium transition hover:bg-amber-50"
            style={{ border: '1px solid #8b6914', color: '#8b6914', backgroundColor: 'transparent' }}
          >
            View
          </button>
        </Link>
        <button
          onClick={onDelete}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition hover:bg-red-50"
          style={{ border: '1px solid #c0392b', color: '#c0392b', backgroundColor: 'transparent' }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
