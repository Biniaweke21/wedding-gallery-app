import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import QRCode from 'qrcode'
import { createServerSupabase } from '@/lib/supabase'
import { checkAndExpireGallery } from '@/lib/expiry'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { QRCodeDisplay } from '@/components/qr-code-display'
import AdminCommentList from '@/components/admin-comment-list'

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

  const isExpired = checkedGallery.status === 'expired'

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm mb-5 hover:underline" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
                {checkedGallery.couple_names}
              </h1>
              <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
                {new Date(checkedGallery.wedding_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Link href={`/${slug}`} target="_blank">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-amber-50" style={{ border: '1px solid var(--color-gold)', color: 'var(--color-gold)', backgroundColor: 'transparent', fontFamily: 'var(--font-body)' }}>
                <ExternalLink className="w-4 h-4" />
                View Live Gallery
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl p-6" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-sand)' }}>
            <div style={{ borderBottom: '1px solid var(--color-sand)', paddingBottom: '12px', marginBottom: '12px' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>Views</span>
                <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>{checkedGallery.view_count}</span>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid var(--color-sand)', paddingBottom: '12px', marginBottom: '12px' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>Comments</span>
                <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>{checkedGallery.comment_count}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>Status</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={isExpired
                  ? { backgroundColor: '#f3f4f6', color: '#6b7280' }
                  : { backgroundColor: '#ecfdf5', color: '#27ae60' }}
              >
                {isExpired ? 'Expired' : 'Active'}
              </span>
            </div>
          </div>

          <div className="rounded-xl p-6 flex flex-col justify-center" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-sand)' }}>
            <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>Active Until</p>
            {daysUntilExpiry !== null ? (
              <>
                <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: isExpired ? '#6b7280' : 'var(--color-gold)' }}>
                  {isExpired ? 'Expired' : `${daysUntilExpiry} days remaining`}
                </p>
                {checkedGallery.expires_at && (
                  <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
                    {checkedGallery.expires_at.slice(0, 10)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>No expiry set</p>
            )}
          </div>

          <QRCodeDisplay qrDataUrl={qrDataUrl} guestUrl={guestUrl} />
        </div>

        {photosWithUrls.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
              Wedding Photos <span className="text-base font-normal" style={{ color: '#a0856c' }}>· {photosWithUrls.length}</span>
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {photosWithUrls.map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-sand)' }}>
                  <img src={photo.url} alt="Wedding photo" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
              Guest Comments <span className="text-base font-normal" style={{ color: '#a0856c' }}>· {comments?.length ?? 0}</span>
            </h2>
            <a href={`/api/galleries/${checkedGallery.id}/comments-pdf`} download className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-amber-50" style={{ border: '1px solid var(--color-gold)', color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}>
              Download Wishes (PDF)
            </a>
          </div>
          <AdminCommentList comments={comments ?? []} />
        </div>
      </div>
    </div>
  )
}
