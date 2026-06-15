'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GalleryCard } from '@/components/gallery-card'
import { MoreVertical, Plus, LogOut } from 'lucide-react'

// Mock galleries data
const MOCK_GALLERIES = [
  {
    id: 1,
    couple: 'Abel & Selam',
    date: '2024-06-15',
    status: 'Active',
    viewCount: 342,
    commentCount: 28,
    slug: 'abel-and-selam',
    expiresAt: '2024-07-15',
  },
  {
    id: 2,
    couple: 'Yohannes & Almaz',
    date: '2024-05-20',
    status: 'Active',
    viewCount: 156,
    commentCount: 12,
    slug: 'yohannes-and-almaz',
    expiresAt: '2024-06-20',
  },
  {
    id: 3,
    couple: 'Dawit & Marta',
    date: '2024-04-10',
    status: 'Expired',
    viewCount: 89,
    commentCount: 5,
    slug: 'dawit-and-marta',
    expiresAt: '2024-05-10',
  },
]

export default function AdminDashboard() {
  const [galleries, setGalleries] = useState(MOCK_GALLERIES)

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this gallery?')) {
      setGalleries(galleries.filter((g) => g.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-primary/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Studio Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your wedding galleries</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create Gallery Button */}
        <div className="mb-8">
          <Link href="/admin/galleries/new">
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              New Couple / New Wedding
            </Button>
          </Link>
        </div>

        {/* Galleries Section */}
        <div>
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">Your Galleries</h2>
          {galleries.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No galleries yet</p>
                <Link href="/admin/galleries/new">
                  <Button>Create Your First Gallery</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {galleries.map((gallery) => (
                <GalleryCard
                  key={gallery.id}
                  gallery={gallery}
                  onDelete={() => handleDelete(gallery.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
