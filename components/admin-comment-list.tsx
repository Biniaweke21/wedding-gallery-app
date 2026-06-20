'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface Comment {
  id: string
  guest_name: string
  message: string
  created_at: string
}

interface AdminCommentListProps {
  comments: Comment[]
}

export default function AdminCommentList({ comments: initial }: AdminCommentListProps) {
  const [comments, setComments] = useState(initial)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error ?? 'Failed to delete comment')
      return
    }
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  if (comments.length === 0) {
    return (
      <div className="py-12 text-center rounded-xl" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-sand)' }}>
        <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>No comments yet</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-sand)' }}>
      {comments.map((comment, i) => (
        <div
          key={comment.id}
          className="group flex gap-3 px-5 py-4"
          style={{ borderBottom: i < comments.length - 1 ? '1px solid var(--color-sand)' : 'none' }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-base font-medium" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-berry)' }}>
                {comment.guest_name}
              </span>
              <span className="text-xs" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
                {new Date(comment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>{comment.message}</p>
          </div>
          <button
            onClick={() => handleDelete(comment.id)}
            className="shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            style={{ color: '#c0392b' }}
            title="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
