'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      return
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--color-sand)',
    backgroundColor: '#ffffff',
    color: 'var(--color-ink)',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--color-parchment)' }}>
      <div className="w-full max-w-md">
        <div className="rounded-xl shadow-sm p-8" style={{ backgroundColor: '#fffef9', border: '1px solid var(--color-sand)' }}>
          <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
            Studio Login
          </h1>
          <p className="text-sm mb-8" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
            Sign in to manage your wedding galleries
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
                Email
              </label>
              <input id="email" type="email" placeholder="studio@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} className="focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
                Password
              </label>
              <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} className="focus:ring-2 focus:ring-amber-400" />
            </div>

            {error && <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#c0392b' }}>{error}</p>}

            <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-berry)' }}>
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm hover:underline" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
