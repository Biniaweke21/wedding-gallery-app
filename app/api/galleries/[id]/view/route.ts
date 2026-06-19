import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleSupabase } from '@/lib/supabase'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { viewToken } = await req.json()

  if (!viewToken) {
    return NextResponse.json({ error: 'Missing viewToken' }, { status: 400 })
  }

  const supabase = createServiceRoleSupabase()

  const { error: insertError } = await supabase
    .from('view_tokens')
    .insert({ token: viewToken })

  if (insertError) {
    return NextResponse.json({ success: true, counted: false })
  }

  await supabase.rpc('increment_view_count', { gallery_id: id })

  return NextResponse.json({ success: true, counted: true })
}
