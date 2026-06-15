'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhotoGrid } from '@/components/photo-grid'
import { CommentList } from '@/components/comment-list'
import { ArrowLeft, Download, Trash2 } from 'lucide-react'

// Mock gallery data
const MOCK_GALLERY = {
  couple: 'Abel & Selam',
  weddingDate: '2024-06-15',
  expiresAt: '2024-07-15',
  viewCount: 342,
  commentCount: 28,
  message: 'We are so grateful to have captured these beautiful moments with our loved ones.',
  photos: [
    { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=500&fit=crop' },
    { id: 2, url: 'https://images.unsplash.com/photo-1531042356691-2ff0a1b638f5?w=500&h=500&fit=crop' },
    { id: 3, url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=500&fit=crop' },
    { id: 4, url: 'https://images.unsplash.com/photo-1554224311-beee415c15c9?w=500&h=500&fit=crop' },
    { id: 5, url: 'https://images.unsplash.com/photo-1530519387789-4c1017266635?w=500&h=500&fit=crop' },
    { id: 6, url: 'https://images.unsplash.com/photo-1536625482828-6cb113ff46cb?w=500&h=500&fit=crop' },
  ],
  comments: [
    {
      id: 1,
      name: 'Yohannes',
      message: 'What a beautiful celebration! Thank you for sharing these wonderful memories.',
      timestamp: '2024-06-16T10:30:00',
    },
    {
      id: 2,
      name: 'Almaz',
      message: 'Simply stunning! The photos capture the joy perfectly.',
      timestamp: '2024-06-16T14:45:00',
    },
    {
      id: 3,
      name: 'Dawit',
      message: 'Congratulations! Wishing you all the best.',
      timestamp: '2024-06-17T08:15:00',
    },
  ],
}

export default function AdminGalleryView({ params }: { params: { slug: string } }) {
  const [comments, setComments] = useState(MOCK_GALLERY.comments)

  const deleteComment = (id: number) => {
    if (confirm('Delete this comment?')) {
      setComments(comments.filter((c) => c.id !== id))
    }
  }

  const daysUntilExpiry = Math.ceil(
    (new Date(MOCK_GALLERY.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-primary/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">{MOCK_GALLERY.couple}</h1>
              <p className="text-sm text-muted-foreground">
                Wedding: {new Date(MOCK_GALLERY.weddingDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download All
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Views</p>
              <p className="text-3xl font-bold text-foreground">{MOCK_GALLERY.viewCount}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Comments</p>
              <p className="text-3xl font-bold text-foreground">{comments.length}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Until</p>
              <p className="text-lg font-bold text-primary">
                {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
              </p>
              <p className="text-xs text-muted-foreground">{MOCK_GALLERY.expiresAt}</p>
            </CardContent>
          </Card>
        </div>

        {/* Photos */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Wedding Photos</h2>
          <PhotoGrid photos={MOCK_GALLERY.photos} />
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Guest Comments</h2>
          {comments.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No comments yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{comment.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{comment.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(comment.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
