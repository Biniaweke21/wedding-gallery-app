'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function NewGallery() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/galleries', {
      method: 'POST',
      body: form,
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }
    router.push(`/admin/galleries/${data.slug}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-serif">Create New Gallery</CardTitle>
            <CardDescription>Set up a beautiful wedding gallery for your couple</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coupleName1">Partner 1 Name *</Label>
                  <Input
                    id="coupleName1"
                    name="coupleName1"
                    placeholder="e.g., Abel"
                    required
                    className="border-primary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coupleName2">Partner 2 Name *</Label>
                  <Input
                    id="coupleName2"
                    name="coupleName2"
                    placeholder="e.g., Selam"
                    required
                    className="border-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding Date *</Label>
                <Input
                  id="weddingDate"
                  name="weddingDate"
                  type="date"
                  required
                  className="border-primary/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Gallery Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Add a welcome message or theme for the gallery..."
                  className="border-primary/30 min-h-24"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating...' : 'Create Gallery'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
