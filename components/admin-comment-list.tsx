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
      <div className="py-12 text-center rounded-2xl" style={{ backgroundColor: '#ffffff', border: '1px solid #e8d5b0' }}>
        <p className="text-sm" style={{ color: '#a0856c' }}>No comments yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-xl p-4 flex gap-3"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e8d5b0' }}
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: '#2c1810' }}>{comment.guest_name}</p>
            <p className="text-sm mt-1" style={{ color: '#4a3728' }}>{comment.message}</p>
            <p className="text-xs italic mt-2" style={{ color: '#a0856c' }}>
              {new Date(comment.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <button
            onClick={() => handleDelete(comment.id)}
            className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-red-50"
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
