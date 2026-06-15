'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: In a real app, this would validate against a backend
    if (email && password) {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-serif">Studio Login</CardTitle>
            <CardDescription>Sign in to manage your wedding galleries</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="studio@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-primary/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-primary/30"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Demo: Use any email and password to continue
            </div>
            <div className="mt-4 text-center">
              <Link href="/" className="text-primary hover:underline text-sm">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
