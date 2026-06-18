'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase'

export async function submitComment(formData: FormData) {
  const galleryId = (formData.get('gallery_id') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const guestName = (formData.get('guest_name') as string).trim()
  const message = (formData.get('message') as string).trim()

  if (!guestName || !message) return

  const supabase = await createServerSupabase()

  await supabase.from('comments').insert({
    gallery_id: galleryId,
    guest_name: guestName,
    message,
  })

  await supabase.rpc('increment_comment_count', { gallery_id: galleryId })

  revalidatePath(`/${slug}`)
}
