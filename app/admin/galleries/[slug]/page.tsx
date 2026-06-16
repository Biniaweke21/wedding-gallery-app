import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import QRCode from 'qrcode'
import { createServerSupabase } from '@/lib/supabase'
import { checkAndExpireGallery } from '@/lib/expiry'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { QRCodeDisplay } from '@/components/qr-code-display'

export default async function AdminGalleryView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: gallery } = await supabase
    .from('galleries')
    .select('id, couple_names, wedding_date, expires_at, view_count, comment_count, theme_message, status')
    .eq('studio_id', process.env.STUDIO_ID!)
    .eq('slug', slug)
    .single()

  if (!gallery) notFound()

  const checkedGallery = await checkAndExpireGallery(supabase, gallery)

  const { data: photos } = await supabase
    .from('photos')
    .select('id, storage_path')
    .eq('gallery_id', checkedGallery.id)
    .order('created_at', { ascending: true })

  const photosWithUrls = (photos ?? []).map((p) => ({
    id: p.id,
    url: supabase.storage.from('photos').getPublicUrl(p.storage_path).data.publicUrl,
  }))

  const { data: comments } = await supabase
    .from('comments')
    .select('id, guest_name, message, created_at')
    .eq('gallery_id', checkedGallery.id)
    .order('created_at', { ascending: false })

  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const guestUrl = `${protocol}://${host}/${slug}`

  const qrDataUrl = await QRCode.toDataURL(guestUrl, { width: 300, margin: 2 })

  const daysUntilExpiry = checkedGallery.expires_at
    ? Math.ceil((new Date(checkedGallery.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-background">
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
              <h1 className="text-3xl font-serif font-bold text-foreground">{checkedGallery.couple_names}</h1>
              <p className="text-sm text-muted-foreground">
                Wedding:{' '}
                {new Date(checkedGallery.wedding_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Link href={`/${slug}`} target="_blank">
              <Button variant="outline" size="sm">
                View Live Gallery
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Views</p>
              <p className="text-3xl font-bold text-foreground">{checkedGallery.view_count}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Comments</p>
              <p className="text-3xl font-bold text-foreground">{checkedGallery.comment_count}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Until</p>
              <p className="text-lg font-bold text-primary">
                {daysUntilExpiry !== null
                  ? daysUntilExpiry > 0
                    ? `${daysUntilExpiry} days`
                    : 'Expired'
                  : '—'}
              </p>
              {checkedGallery.expires_at && (
                <p className="text-xs text-muted-foreground">{checkedGallery.expires_at.slice(0, 10)}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Photos */}
        {photosWithUrls.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Wedding Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photosWithUrls.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                  <img src={photo.url} alt="Wedding photo" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 text-white/60 text-xs font-semibold select-none pointer-events-none drop-shadow">
                    {process.env.NEXT_PUBLIC_STUDIO_ID ?? process.env.STUDIO_ID}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR Code */}
        <QRCodeDisplay qrDataUrl={qrDataUrl} guestUrl={guestUrl} />

        {/* Comments */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Guest Comments</h2>
          {!comments || comments.length === 0 ? (
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
