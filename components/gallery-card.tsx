import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, MessageCircle, Trash2, ExternalLink } from 'lucide-react'

interface Gallery {
  id: number
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
  const statusColor = gallery.status === 'Active' ? 'text-emerald-600' : 'text-muted-foreground'
  const statusBg = gallery.status === 'Active' ? 'bg-emerald-50' : 'bg-muted'

  return (
    <Card className="border-primary/20 overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-foreground">{gallery.couple}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                {gallery.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {new Date(gallery.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{gallery.viewCount} views</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{gallery.commentCount} comments</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/galleries/${gallery.slug}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                View
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
