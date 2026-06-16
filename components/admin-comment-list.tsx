'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
      <Card className="border-primary/20">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No comments yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground">{comment.guest_name}</p>
                <p className="text-sm text-muted-foreground mt-1">{comment.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
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
                className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
                title="Delete comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
