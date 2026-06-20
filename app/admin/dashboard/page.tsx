import Link from 'next/link'
import GalleryList from '@/components/gallery-list'
import { Plus } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase'
import { checkAndExpireGallery } from '@/lib/expiry'

export default async function AdminDashboard() {
  const supabase = await createServerSupabase()
  const { data: rows } = await supabase
    .from('galleries')
    .select('id, slug, couple_names, wedding_date, status, view_count, comment_count, expires_at')
    .eq('studio_id', process.env.STUDIO_ID!)
    .order('created_at', { ascending: false })

  const checked = await Promise.all((rows ?? []).map((g) => checkAndExpireGallery(supabase, g)))

  const galleries = checked.map((g) => ({
    id: g.id,
    couple: g.couple_names,
    date: g.wedding_date,
    status: g.status === 'active' ? 'Active' : 'Expired' as 'Active' | 'Expired',
    viewCount: g.view_count,
    commentCount: g.comment_count,
    slug: g.slug,
    expiresAt: g.expires_at ?? '',
  }))

  const totalViews = galleries.reduce((s, g) => s + g.viewCount, 0)
  const totalComments = galleries.reduce((s, g) => s + g.commentCount, 0)

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
            Your Galleries
          </h1>
          <div className="hidden sm:flex items-center gap-4 text-sm" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
            <span>{galleries.length} {galleries.length === 1 ? 'gallery' : 'galleries'}</span>
            <span style={{ borderLeft: '1px solid var(--color-sand)', paddingLeft: '1rem' }}>{totalViews} views</span>
            <span style={{ borderLeft: '1px solid var(--color-sand)', paddingLeft: '1rem' }}>{totalComments} comments</span>
          </div>
        </div>
        <Link href="/admin/galleries/new">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-berry)' }}>
            <Plus className="w-4 h-4" />
            New Wedding
          </button>
        </Link>
      </div>

      {galleries.length === 0 ? (
        <div className="text-center py-24">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>No galleries yet</h2>
          <p className="text-sm mb-6" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>Create your first gallery to get started</p>
          <Link href="/admin/galleries/new">
            <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-berry)' }}>
              Create your first gallery
            </button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid var(--color-sand)', backgroundColor: '#ffffff' }}>
          <GalleryList galleries={galleries} />
        </div>
      )}
    </main>
  )
}
