import TibebBorder from '@/components/tibeb-border'
import ViewTracker from '@/components/view-tracker'
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

  const viewToken = crypto.randomUUID()

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-parchment)' }}>
      <ViewTracker galleryId={checkedGallery.id} viewToken={viewToken} />
      <header>
        <TibebBorder delay={0} />
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 text-center">
          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-tight anim-fade-rise"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-ink)',
              animationDuration: '600ms',
              animationDelay: '400ms',
              animationFillMode: 'backwards',
              animationTimingFunction: 'ease-out',
            }}
          >
            {checkedGallery.couple_names}
          </h1>
          <p
            className="mt-3 text-sm uppercase tracking-wide anim-fade-rise"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-gold)',
              animationDuration: '600ms',
              animationDelay: '550ms',
              animationFillMode: 'backwards',
              animationTimingFunction: 'ease-out',
            }}
          >
            {new Date(checkedGallery.wedding_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
            }).toUpperCase()} · {new Date(checkedGallery.wedding_date).getFullYear()}
          </p>
          <div
            className="mx-auto mt-4 mb-4 anim-scale-x"
            style={{
              width: '48px',
              height: '1px',
              backgroundColor: 'var(--color-gold)',
              transformOrigin: 'center',
              animationDuration: '400ms',
              animationDelay: '700ms',
              animationFillMode: 'backwards',
              animationTimingFunction: 'ease-out',
            }}
          />
        </div>
        <TibebBorder delay={750} />
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        {checkedGallery.theme_message && (
          <div className="py-10 sm:py-14 text-center max-w-xl mx-auto">
            <span className="block text-5xl leading-none mb-4" style={{ color: 'var(--color-gold)', opacity: 0.4 }}>❝</span>
            <p className="text-xl italic leading-relaxed" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
              {checkedGallery.theme_message}
            </p>
          </div>
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
          <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
            Guest Wishes ({comments?.length ?? 0})
          </h2>
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="h-px w-12" style={{ backgroundColor: '#d4a839' }} />
              <span className="text-xs" style={{ color: '#d4a839' }}>✦</span>
              <div className="h-px w-12" style={{ backgroundColor: '#d4a839' }} />
            </div>
          </div>
          <div className="space-y-5 mb-8">
            {!comments || comments.length === 0 ? (
              <p className="text-sm italic text-center py-6" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>No wishes yet — be the first!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-l-2 pl-4 py-2" style={{ borderColor: 'var(--color-sand)' }}>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-base font-medium" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-berry)' }}>{comment.guest_name}</span>
                    <span className="text-xs" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mt-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>{comment.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="rounded-xl shadow-sm p-6 sm:p-8" style={{ backgroundColor: '#fffef9', border: '1px solid var(--color-sand)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>Leave Your Wishes</h3>
            <form action={submitComment} className="space-y-4">
              <input type="hidden" name="gallery_id" value={checkedGallery.id} />
              <input type="hidden" name="slug" value={slug} />
              <div className="space-y-1">
                <Label htmlFor="guest_name" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>Your Name</Label>
                <Input id="guest_name" name="guest_name" placeholder="Your name" required className="focus:ring-2 focus:ring-[var(--color-gold)]" style={{ borderColor: 'var(--color-sand)', backgroundColor: '#ffffff', color: 'var(--color-ink)' }} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>Message</Label>
                <Textarea id="message" name="message" placeholder="Share your wishes..." required className="min-h-24 focus:ring-2 focus:ring-[var(--color-gold)]" style={{ borderColor: 'var(--color-sand)', backgroundColor: '#ffffff', color: 'var(--color-ink)' }} />
              </div>
              <Button type="submit" className="w-full rounded-full text-white font-semibold hover:opacity-90 transition-opacity" style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-berry)' }}>
                Send Wishes
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
