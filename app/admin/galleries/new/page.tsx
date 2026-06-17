'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, X } from 'lucide-react'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_FILES = 20
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface FileEntry {
  file: File
  preview: string
  error?: string
}

export default function NewGallery() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([])

  const addFiles = (incoming: File[]) => {
    const entries: FileEntry[] = incoming.map((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return { file, preview: '', error: `${file.name}: unsupported type` }
      }
      if (file.size > MAX_FILE_SIZE) {
        return { file, preview: '', error: `${file.name}: exceeds 5MB` }
      }
      return { file, preview: URL.createObjectURL(file) }
    })

    setFileEntries((prev) => {
      const combined = [...prev, ...entries]
      return combined.slice(0, MAX_FILES)
    })
  }

  const removeFile = (index: number) => {
    setFileEntries((prev) => {
      const updated = [...prev]
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    addFiles(Array.from(e.dataTransfer.files))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/galleries', { method: 'POST', body: form })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    const slug = data.slug as string
    const galleryId = data.id as string
    const studioId = data.studioId as string

    const validFiles = fileEntries.filter((e) => !e.error)

    if (validFiles.length > 0) {
      const failedFiles: string[] = []

      for (let i = 0; i < validFiles.length; i++) {
        setUploadProgress(`Uploading ${i + 1}/${validFiles.length}...`)
        const { file } = validFiles[i]

        const fileForm = new FormData()
        fileForm.append('file', file)
        fileForm.append('gallery_id', galleryId)
        fileForm.append('slug', slug)

        const uploadRes = await fetch('/api/photos/upload', {
          method: 'POST',
          body: fileForm,
        })

        if (!uploadRes.ok) {
          failedFiles.push(file.name)
        }
      }

      if (failedFiles.length > 0) {
        setUploadProgress(null)
        setError(`Some files failed to upload: ${failedFiles.join(', ')}`)
      }
    }

    router.push(`/admin/galleries/${slug}`)
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
                  <Input id="coupleName1" name="coupleName1" placeholder="e.g., Abel" required className="border-primary/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coupleName2">Partner 2 Name *</Label>
                  <Input id="coupleName2" name="coupleName2" placeholder="e.g., Selam" required className="border-primary/30" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding Date *</Label>
                <Input id="weddingDate" name="weddingDate" type="date" required className="border-primary/30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Gallery Message (Optional)</Label>
                <Textarea id="message" name="message" placeholder="Add a welcome message..." className="border-primary/30 min-h-24" />
              </div>

              {/* File upload */}
              <div className="space-y-2">
                <Label>Wedding Photos</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
                >
                  <Upload className="w-10 h-10 text-primary/50 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Drag photos here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — max 5MB each, up to 20 files</p>
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
                  />
                </div>

                {fileEntries.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {fileEntries.map((entry, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-secondary border border-primary/10">
                        {entry.error ? (
                          <div className="w-full h-full flex items-center justify-center p-2 bg-destructive/10">
                            <p className="text-xs text-destructive text-center break-words">{entry.error}</p>
                          </div>
                        ) : (
                          <img src={entry.preview} alt="" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                          className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black/80"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {uploadProgress && <p className="text-sm text-muted-foreground">{uploadProgress}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (uploadProgress ?? 'Creating...') : 'Create Gallery'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
