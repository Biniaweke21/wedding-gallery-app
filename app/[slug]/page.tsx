'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhotoGalleryLightbox } from '@/components/photo-gallery-lightbox'
import { CommentFeed } from '@/components/comment-feed'
import { CommentForm } from '@/components/comment-form'

// Mock public gallery data
const MOCK_PUBLIC_GALLERY = {
  couple: 'Abel & Selam',
  weddingDate: '2024-06-15',
  expiresAt: '2024-07-15',
  studioLogo: '📷',
  message: 'Thank you for celebrating with us! We&apos;re so grateful to share these beautiful moments.',
  photos: [
    { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop' },
    { id: 2, url: 'https://images.unsplash.com/photo-1531042356691-2ff0a1b638f5?w=800&h=600&fit=crop' },
    { id: 3, url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop' },
    { id: 4, url: 'https://images.unsplash.com/photo-1554224311-beee415c15c9?w=800&h=600&fit=crop' },
    { id: 5, url: 'https://images.unsplash.com/photo-1530519387789-4c1017266635?w=800&h=600&fit=crop' },
    { id: 6, url: 'https://images.unsplash.com/photo-1536625482828-6cb113ff46cb?w=800&h=600&fit=crop' },
  ],
  initialComments: [
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
      message: 'Congratulations! Wishing you all the best. Looking forward to more celebrations!',
      timestamp: '2024-06-17T08:15:00',
    },
  ],
}

export default function PublicGallery({ params }: { params: { slug: string } }) {
  const [comments, setComments] = useState(MOCK_PUBLIC_GALLERY.initialComments)

  const daysUntilExpiry = Math.ceil(
    (new Date(MOCK_PUBLIC_GALLERY.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  const isExpired = daysUntilExpiry <= 0

  const handleCommentSubmit = (name: string, message: string) => {
    const newComment = {
      id: comments.length + 1,
      name,
      message,
      timestamp: new Date().toISOString(),
    }
    setComments([newComment, ...comments])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">{MOCK_PUBLIC_GALLERY.studioLogo}</span>
            <div className="text-right">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground text-pretty">
                {MOCK_PUBLIC_GALLERY.couple}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {new Date(MOCK_PUBLIC_GALLERY.weddingDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Availability Banner */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-primary font-medium">
            {isExpired ? (
              <span>This gallery has expired</span>
            ) : (
              <span>
                This gallery is available until{' '}
                <strong>
                  {new Date(MOCK_PUBLIC_GALLERY.expiresAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </strong>{' '}
                ({daysUntilExpiry} days remaining)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Gallery Message */}
        {MOCK_PUBLIC_GALLERY.message && (
          <Card className="mb-12 border-primary/20 bg-white">
            <CardContent className="pt-6">
              <p className="text-lg text-foreground text-center text-pretty">
                {MOCK_PUBLIC_GALLERY.message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Photo Gallery */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
            Wedding Gallery
          </h2>
          <PhotoGalleryLightbox photos={MOCK_PUBLIC_GALLERY.photos} />
        </div>

        {/* Comments Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-serif font-bold text-foreground text-center">
            Share Your Wishes
          </h2>

          {/* Comment Form */}
          <CommentForm onSubmit={handleCommentSubmit} disabled={isExpired} />

          {/* Comments Feed */}
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-6">
              Guest Comments ({comments.length})
            </h3>
            <CommentFeed comments={comments} />
          </div>
        </div>
      </main>
    </div>
  )
}
