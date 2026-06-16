import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: comment } = await supabase
    .from('comments')
    .select('id, gallery_id')
    .eq('id', id)
    .single()

  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  }

  const { data: gallery } = await supabase
    .from('galleries')
    .select('id, comment_count')
    .eq('id', comment.gallery_id)
    .eq('studio_id', process.env.STUDIO_ID!)
    .single()

  if (!gallery) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase.from('comments').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase
    .from('galleries')
    .update({ comment_count: Math.max(0, gallery.comment_count - 1) })
    .eq('id', gallery.id)

  return NextResponse.json({ success: true })
}
