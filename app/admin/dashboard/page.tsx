import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import GalleryList from '@/components/gallery-list'
import { Plus, LogOut } from 'lucide-react'
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
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-primary/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Studio Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your wedding galleries</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/admin/galleries/new">
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              New Couple / New Wedding
            </Button>
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">Your Galleries</h2>
          {galleries.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No galleries yet — create your first one</p>
                <Link href="/admin/galleries/new">
                  <Button>Create Your First Gallery</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <GalleryList galleries={galleries} />
          )}
        </div>
      </main>
    </div>
  )
}
