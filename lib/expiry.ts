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
    const { error: updateError } = await supabase
      .from('galleries')
      .update({ status: 'expired' })
      .eq('id', gallery.id)

    if (!updateError) {
      const { data: photos } = await supabase
        .from('photos')
        .select('id, storage_path')
        .eq('gallery_id', gallery.id)

      if (photos && photos.length > 0) {
        const paths = photos.map((p) => p.storage_path)

        const { error: storageError } = await supabase.storage.from('photos').remove(paths)
        if (storageError) console.error('Expiry: storage delete failed:', storageError.message)

        const { error: rowsError } = await supabase
          .from('photos')
          .delete()
          .eq('gallery_id', gallery.id)
        if (rowsError) console.error('Expiry: photo rows delete failed:', rowsError.message)
      }
    }

    return { ...gallery, status: 'expired' }
  }
  return gallery
}
