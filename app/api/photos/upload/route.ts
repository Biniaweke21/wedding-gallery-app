export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
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
  const arrayBuffer = await file.arrayBuffer()
  const inputBuffer = Buffer.from(arrayBuffer)

  let compressed: Buffer
  try {
    compressed = await sharp(inputBuffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 80 })
      .toBuffer()
  } catch (err) {
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 })
  }

  const baseName = file.name.replace(/\.[^.]+$/, '')
  const storagePath = `${studioId}/${slug}/${Date.now()}-${baseName}.jpg`

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(storagePath, compressed, { contentType: 'image/jpeg' })

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
