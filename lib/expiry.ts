import type { createServerSupabase } from '@/lib/supabase'

type SupabaseClient = Awaited<ReturnType<typeof createServerSupabase>>

interface Gallery {
  id: string
  expires_at: string | null
  status: string
}

export async function checkAndExpireGallery<T extends Gallery>(
  supabase: SupabaseClient,
  gallery: T
): Promise<T> {
  if (
    gallery.status === 'active' &&
    gallery.expires_at &&
    new Date(gallery.expires_at) < new Date()
  ) {
    await supabase.from('galleries').update({ status: 'expired' }).eq('id', gallery.id)
    return { ...gallery, status: 'expired' }
  }
  return gallery
}
