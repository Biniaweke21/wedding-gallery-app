export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null
  const galleryId = form.get('gallery_id') as string | null
  const slug = form.get('slug') as string | null

  if (!file || !galleryId || !slug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const studioId = process.env.STUDIO_ID!
  const storagePath = `${studioId}/${slug}/${Date.now()}-${file.name}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(storagePath, buffer, { contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { error: insertError } = await supabase.from('photos').insert({
    gallery_id: galleryId,
    storage_path: storagePath,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, storagePath })
}
