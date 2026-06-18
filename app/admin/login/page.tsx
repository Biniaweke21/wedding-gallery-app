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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#fafaf9' }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-md" style={{ backgroundColor: '#ffffff', border: '1px solid #e8d5b0' }}>
          <h1 className="text-3xl font-serif font-bold text-center mb-2" style={{ color: '#2c1810' }}>
            Studio Login
          </h1>
          <p className="text-sm text-center mb-8" style={{ color: '#a0856c' }}>
            Sign in to manage your wedding galleries
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: '#2c1810' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="studio@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 transition"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e8d5b0', color: '#2c1810' }}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: '#2c1810' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 transition"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e8d5b0', color: '#2c1810' }}
              />
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: '#c0392b' }}>{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#8b6914' }}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm hover:underline" style={{ color: '#a0856c' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
