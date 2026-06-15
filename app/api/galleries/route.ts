import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

function toSlug(name1: string, name2: string): string {
  const clean = (s: string) =>
    s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return `${clean(name1)}-and-${clean(name2)}`
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const coupleName1 = (form.get('coupleName1') as string).trim()
  const coupleName2 = (form.get('coupleName2') as string).trim()
  const weddingDate = form.get('weddingDate') as string
  const message = (form.get('message') as string | null) ?? null

  const studioId = process.env.STUDIO_ID!
  const supabase = await createServerSupabase()

  const baseSlug = toSlug(coupleName1, coupleName2)

  const { data: existing } = await supabase
    .from('galleries')
    .select('slug')
    .eq('studio_id', studioId)
    .like('slug', `${baseSlug}%`)

  let slug = baseSlug
  if (existing && existing.length > 0) {
    const taken = new Set(existing.map((r) => r.slug))
    if (taken.has(slug)) {
      let i = 2
      while (taken.has(`${baseSlug}-${i}`)) i++
      slug = `${baseSlug}-${i}`
    }
  }

  const createdAt = new Date()
  const expiresAt = new Date(createdAt)
  expiresAt.setDate(expiresAt.getDate() + 7)

  const { error } = await supabase.from('galleries').insert({
    studio_id: studioId,
    slug,
    couple_names: `${coupleName1} & ${coupleName2}`,
    wedding_date: weddingDate,
    theme_message: message || null,
    created_at: createdAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    status: 'active',
    view_count: 0,
    comment_count: 0,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ slug })
}
