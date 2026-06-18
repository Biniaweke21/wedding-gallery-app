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

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold" style={{ color: '#2c1810' }}>Your Galleries</h1>
        <Link href="/admin/galleries/new">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#8b6914' }}
          >
            <Plus className="w-4 h-4" />
            New Wedding
          </button>
        </Link>
      </div>

      {galleries.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-serif mb-2" style={{ color: '#2c1810' }}>No galleries yet</h2>
          <p className="text-sm mb-6" style={{ color: '#a0856c' }}>Create your first gallery to get started</p>
          <Link href="/admin/galleries/new">
            <button
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#8b6914' }}
            >
              Create your first gallery
            </button>
          </Link>
        </div>
      ) : (
        <GalleryList galleries={galleries} />
      )}
    </main>
  )
}
