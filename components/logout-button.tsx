'use client'

import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium px-4 py-2 rounded-full transition-colors hover:bg-amber-50"
      style={{ color: '#a0856c' }}
    >
      Log out
    </button>
  )
}
