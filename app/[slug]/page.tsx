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

  await supabase.rpc('increment_view_count', { gallery_id: checkedGallery.id })

  if (checkedGallery.status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#fdf8f2' }}>
        <p className="text-lg italic text-center" style={{ color: '#a0856c' }}>This gallery has expired.</p>
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
    <div className="min-h-screen" style={{ backgroundColor: '#fdf8f2' }}>
      <header style={{ backgroundColor: '#fffef9', borderBottom: '1px solid #e8d5b0' }}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-5xl font-serif font-bold" style={{ color: '#2c1810' }}>
            {checkedGallery.couple_names}
          </h1>
          <div className="border-b-2 border-amber-300 w-16 mt-3 mb-2" />
          <p className="font-medium" style={{ color: '#8b6914' }}>
            {new Date(checkedGallery.wedding_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {expiryDate && (
            <p className="text-xs italic mt-2" style={{ color: '#a0856c' }}>
              This gallery is available until {expiryDate}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        {checkedGallery.theme_message && (
          <Card style={{ backgroundColor: '#fffef9', borderColor: '#e8d5b0' }}>
            <CardContent className="pt-6 pb-6">
              <span className="block text-center text-3xl" style={{ color: '#d4a839' }}>❝</span>
              <p className="text-lg italic text-center" style={{ color: '#2c1810' }}>
                {checkedGallery.theme_message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Photos */}
        <div>
          <h2 className="text-2xl font-serif font-bold mb-2" style={{ color: '#2c1810' }}>Wedding Gallery</h2>
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-2">
              <div className="h-px w-12" style={{ backgroundColor: '#d4a839' }} />
              <span className="text-xs" style={{ color: '#d4a839' }}>✦</span>
              <div className="h-px w-12" style={{ backgroundColor: '#d4a839' }} />
            </div>
          </div>
          {!photosWithUrls || photosWithUrls.length === 0 ? (
            <p className="text-sm italic" style={{ color: '#a0856c' }}>No photos yet.</p>
          ) : (
            <GuestPhotoGrid photos={photosWithUrls} />
          )}
        </div>

        {/* Comments */}
        <div>
          <h2 className="text-2xl font-serif font-bold mb-4" style={{ color: '#2c1810' }}>
            Guest Wishes ({comments?.length ?? 0})
          </h2>
          <div className="space-y-4 mb-8">
            {!comments || comments.length === 0 ? (
              <p className="text-sm italic" style={{ color: '#a0856c' }}>No wishes yet — be the first!</p>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="shadow-sm" style={{ backgroundColor: '#fffef9', borderColor: '#e8d5b0' }}>
                  <CardContent className="pt-4 pb-4">
                    <p className="font-semibold" style={{ color: '#2c1810' }}>{comment.guest_name}</p>
                    <p className="text-sm mt-1" style={{ color: '#4a3728' }}>{comment.message}</p>
                    <p className="text-xs italic mt-2" style={{ color: '#a0856c' }}>
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

          <Card style={{ backgroundColor: '#fffef9', borderColor: '#e8d5b0' }}>
            <CardContent className="pt-6">
              <h3 className="text-lg font-serif font-semibold mb-4" style={{ color: '#2c1810' }}>Leave Your Wishes</h3>
              <form action={submitComment} className="space-y-4">
                <input type="hidden" name="gallery_id" value={checkedGallery.id} />
                <input type="hidden" name="slug" value={slug} />
                <div className="space-y-1">
                  <Label htmlFor="guest_name" style={{ color: '#4a3728' }}>Your Name</Label>
                  <Input id="guest_name" name="guest_name" placeholder="Your name" required className="focus:ring-amber-400" style={{ borderColor: '#e8d5b0', backgroundColor: '#ffffff', color: '#2c1810' }} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message" style={{ color: '#4a3728' }}>Message</Label>
                  <Textarea id="message" name="message" placeholder="Share your wishes..." required className="min-h-24 focus:ring-amber-400" style={{ borderColor: '#e8d5b0', backgroundColor: '#ffffff', color: '#2c1810' }} />
                </div>
                <Button type="submit" className="w-full rounded-full text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#8b6914' }}>
                  Send Wishes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
