'use client'

import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Log out
    </Button>
  )
}
