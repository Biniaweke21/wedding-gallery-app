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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'var(--font-body)',
  color: 'var(--color-ink)',
  marginBottom: '6px',
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
        const resizedFile = new File([resized], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
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

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:underline" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>New Wedding Gallery</h1>
          <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>Add the couple's details and photos to generate their gallery.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-sand)' }}>
            <div className="flex flex-col lg:flex-row">
              <div className="flex-[55] p-8 space-y-5">
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
                  <input id="weddingDate" name="weddingDate" type="date" required style={inputStyle} className="focus:ring-2 focus:ring-amber-400 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.4] [&::-webkit-calendar-picker-indicator]:sepia [&::-webkit-calendar-picker-indicator]:saturate-200 [&::-webkit-calendar-picker-indicator]:hue-rotate-[10deg]" />
                </div>

                <div>
                  <label htmlFor="message" style={labelStyle}>Gallery Message (Optional)</label>
                  <textarea id="message" name="message" placeholder="Add a welcome message..." style={{ ...inputStyle, minHeight: '96px', resize: 'vertical' }} className="focus:ring-2 focus:ring-amber-400" />
                </div>

                {error && <p className="text-xs" style={{ fontFamily: 'var(--font-body)', color: '#c0392b' }}>{error}</p>}

                <button type="submit" disabled={loading} className="w-full py-2.5 px-6 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60" style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-berry)' }}>
                  {loading ? (uploadProgress ?? 'Creating...') : 'Create Gallery'}
                </button>
              </div>

              <div className="hidden lg:block w-px" style={{ backgroundColor: 'var(--color-sand)' }} />

              <div className="flex-[45] p-8">
                <label style={labelStyle}>Wedding Photos</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => inputRef.current?.click()}
                  className="cursor-pointer rounded-xl p-8 text-center transition-colors hover:bg-amber-50"
                  style={{ border: '2px dashed var(--color-sand)', backgroundColor: '#fdf8f2' }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-gold)' }} />
                  <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>Drag photos here or click to browse</p>
                  <p className="text-xs mt-1" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>JPG, PNG, WebP — max 5MB each, up to 20 files</p>
                  <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => addFiles(Array.from(e.target.files ?? []))} />
                </div>

                {uploadProgress && <p className="text-xs mt-3" style={{ fontFamily: 'var(--font-body)', color: '#a0856c' }}>{uploadProgress}</p>}

                {fileEntries.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {fileEntries.map((entry, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-sand)' }}>
                        {entry.error ? (
                          <div className="w-full h-full flex items-center justify-center p-2" style={{ backgroundColor: '#fef2f2' }}>
                            <p className="text-xs text-center break-words" style={{ color: '#c0392b' }}>{entry.error}</p>
                          </div>
                        ) : (
                          <img src={entry.preview} alt="" className="w-full h-full object-cover" />
                        )}
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i) }} className="absolute top-1 right-1 rounded-full p-0.5 text-white hover:bg-black/80 transition-colors" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
