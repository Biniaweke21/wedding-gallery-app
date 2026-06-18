'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_FILES = 20
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

async function resizeImage(file: File, maxWidth = 1600, quality = 0.8): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality)
    }
    img.src = url
  })
}

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
    setFileEntries((prev) => [...prev, ...entries].slice(0, MAX_FILES))
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

    const validFiles = fileEntries.filter((e) => !e.error)

    if (validFiles.length > 0) {
      const failedFiles: string[] = []

      for (let i = 0; i < validFiles.length; i++) {
        setUploadProgress(`Uploading ${i + 1}/${validFiles.length}...`)
        const { file } = validFiles[i]

        const resized = await resizeImage(file)
        const resizedFile = new File(
          [resized],
          file.name.replace(/\.[^.]+$/, '.jpg'),
          { type: 'image/jpeg' }
        )

        const fileForm = new FormData()
        fileForm.append('file', resizedFile)
        fileForm.append('gallery_id', galleryId)
        fileForm.append('slug', slug)

        const uploadRes = await fetch('/api/photos/upload', { method: 'POST', body: fileForm })
        if (!uploadRes.ok) failedFiles.push(file.name)
      }

      if (failedFiles.length > 0) {
        setUploadProgress(null)
        setError(`Some files failed to upload: ${failedFiles.join(', ')}`)
      }
    }

    router.push(`/admin/galleries/${slug}`)
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e8d5b0',
    backgroundColor: '#ffffff',
    color: '#2c1810',
    fontSize: '14px',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#2c1810',
    marginBottom: '4px',
  }

  return (
    <div className="py-10 px-4" style={{ backgroundColor: '#fafaf9', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm mb-6 hover:underline"
          style={{ color: '#a0856c' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="rounded-2xl shadow-sm p-8" style={{ backgroundColor: '#ffffff', border: '1px solid #e8d5b0' }}>
          <h1 className="text-3xl font-serif font-bold mb-1" style={{ color: '#2c1810' }}>New Wedding Gallery</h1>
          <p className="text-sm mb-8" style={{ color: '#a0856c' }}>Set up a beautiful gallery for your couple</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="coupleName1" style={labelStyle}>Partner 1 Name *</label>
                <input id="coupleName1" name="coupleName1" placeholder="e.g., Abel" required style={inputStyle} className="focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label htmlFor="coupleName2" style={labelStyle}>Partner 2 Name *</label>
                <input id="coupleName2" name="coupleName2" placeholder="e.g., Selam" required style={inputStyle} className="focus:ring-2 focus:ring-amber-400" />
              </div>
            </div>

            <div>
              <label htmlFor="weddingDate" style={labelStyle}>Wedding Date *</label>
              <input id="weddingDate" name="weddingDate" type="date" required style={inputStyle} className="focus:ring-2 focus:ring-amber-400" />
            </div>

            <div>
              <label htmlFor="message" style={labelStyle}>Gallery Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                placeholder="Add a welcome message..."
                style={{ ...inputStyle, minHeight: '96px', resize: 'vertical' }}
                className="focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label style={labelStyle}>Wedding Photos</label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer rounded-xl p-8 text-center transition-colors hover:bg-amber-50"
                style={{ border: '2px dashed #e8d5b0', backgroundColor: '#fafaf9' }}
              >
                <Upload className="w-10 h-10 mx-auto mb-2" style={{ color: '#8b6914' }} />
                <p className="text-sm font-medium" style={{ color: '#2c1810' }}>Drag photos here or click to browse</p>
                <p className="text-xs mt-1" style={{ color: '#a0856c' }}>JPG, PNG, WebP — max 5MB each, up to 20 files</p>
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
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden" style={{ border: '1px solid #e8d5b0' }}>
                      {entry.error ? (
                        <div className="w-full h-full flex items-center justify-center p-2" style={{ backgroundColor: '#fef2f2' }}>
                          <p className="text-xs text-center break-words" style={{ color: '#c0392b' }}>{entry.error}</p>
                        </div>
                      ) : (
                        <img src={entry.preview} alt="" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                        className="absolute top-1 right-1 rounded-full p-0.5 text-white hover:bg-black/80 transition-colors"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm" style={{ color: '#c0392b' }}>{error}</p>}
            {uploadProgress && <p className="text-sm font-medium" style={{ color: '#8b6914' }}>{uploadProgress}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#8b6914' }}
            >
              {loading ? (uploadProgress ?? 'Creating...') : 'Create Gallery'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
