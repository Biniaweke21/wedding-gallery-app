import GuestPhotoGrid from '@/components/guest-photo-grid'
import { notFound } from 'next/navigation'
import { checkAndExpireGallery } from '@/lib/expiry'
import { createServerSupabase } from '@/lib/supabase'
import { submitComment } from '@/lib/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default async function PublicGallery({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: gallery } = await supabase
    .from('galleries')
    .select('id, couple_names, wedding_date, expires_at, status, theme_message, view_count')
    .eq('slug', slug)
    .eq('studio_id', process.env.STUDIO_ID!)
    .single()

  if (!gallery) notFound()

  const checkedGallery = await checkAndExpireGallery(supabase, gallery)

  supabase.from('galleries').update({ view_count: checkedGallery.view_count + 1 }).eq('id', checkedGallery.id)

  if (checkedGallery.status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-lg text-muted-foreground text-center">This gallery has expired.</p>
      </div>
    )
  }

  const [{ data: photos }, { data: comments }] = await Promise.all([
    supabase
      .from('photos')
      .select('id, storage_path')
      .eq('gallery_id', checkedGallery.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('comments')
      .select('id, guest_name, message, created_at')
      .eq('gallery_id', checkedGallery.id)
      .order('created_at', { ascending: true }),
  ])

  const photosWithUrls = (photos ?? []).map((p) => ({
    id: p.id,
    url: supabase.storage.from('photos').getPublicUrl(p.storage_path).data.publicUrl,
  }))

  const expiryDate = checkedGallery.expires_at
    ? new Date(checkedGallery.expires_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="bg-white border-b border-primary/10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-serif font-bold text-foreground">{checkedGallery.couple_names}</h1>
          <p className="text-muted-foreground mt-1">
            {new Date(checkedGallery.wedding_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {expiryDate && (
            <p className="text-sm text-primary mt-2">
              This gallery is available until {expiryDate}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        {gallery.theme_message && (
          <Card className="border-primary/20 bg-white">
            <CardContent className="pt-6">
              <p className="text-foreground text-center">{checkedGallery.theme_message}</p>
            </CardContent>
          </Card>
        )}

        {/* Photos */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Wedding Gallery</h2>
          {!photosWithUrls || photosWithUrls.length === 0 ? (
            <p className="text-muted-foreground text-sm">No photos yet.</p>
          ) : (
            <GuestPhotoGrid photos={photosWithUrls} />
          )}
        </div>

        {/* Comments */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
            Guest Wishes ({comments?.length ?? 0})
          </h2>
          <div className="space-y-4 mb-8">
            {!comments || comments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No wishes yet — be the first!</p>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="border-primary/20 bg-white">
                  <CardContent className="pt-4 pb-4">
                    <p className="font-semibold text-foreground">{comment.guest_name}</p>
                    <p className="text-sm text-foreground mt-1">{comment.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Comment form — submit wired in next step */}
          <Card className="border-primary/20 bg-white">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Leave Your Wishes</h3>
              <form action={submitComment} className="space-y-4">
                <input type="hidden" name="gallery_id" value={checkedGallery.id} />
                <input type="hidden" name="slug" value={slug} />
                <div className="space-y-1">
                  <Label htmlFor="guest_name">Your Name</Label>
                  <Input id="guest_name" name="guest_name" placeholder="Your name" required className="border-primary/30" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Share your wishes..." required className="border-primary/30 min-h-24" />
                </div>
                <Button type="submit" className="w-full">Send Wishes</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
