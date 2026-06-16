import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: photos } = await supabase
    .from('photos')
    .select('storage_path')
    .eq('gallery_id', id)

  if (photos && photos.length > 0) {
    const paths = photos.map((p) => p.storage_path)
    const { error: storageError } = await supabase.storage.from('photos').remove(paths)
    if (storageError) {
      console.error('Storage delete failed:', storageError.message)
    }
  }

  const { error } = await supabase
    .from('galleries')
    .delete()
    .eq('id', id)
    .eq('studio_id', process.env.STUDIO_ID!)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
