import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase'

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { viewToken } = await req.json()

  if (!viewToken) {
    return NextResponse.json({ error: 'Missing viewToken' }, { status: 400 })
  }

  const { error: insertError } = await serviceClient
    .from('view_tokens')
    .insert({ token: viewToken })

  if (insertError) {
    return NextResponse.json({ success: true, counted: false })
  }

  const supabase = await createServerSupabase()
  await supabase.rpc('increment_view_count', { gallery_id: id })

  return NextResponse.json({ success: true, counted: true })
}
