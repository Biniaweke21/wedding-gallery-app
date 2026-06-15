'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUploadArea } from '@/components/file-upload-area'
import { QRCodeDisplay } from '@/components/qr-code-display'
import { SuccessState } from '@/components/success-state'
import { ArrowLeft } from 'lucide-react'

export default function NewGallery() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [formData, setFormData] = useState({
    coupleName1: '',
    coupleName2: '',
    weddingDate: '',
    message: '',
    files: [] as File[],
  })
  const [generatedSlug, setGeneratedSlug] = useState('')

  const generateSlug = (name1: string, name2: string) => {
    return `${name1.toLowerCase().replace(/\s+/g, '-')}-and-${name2.toLowerCase().replace(/\s+/g, '-')}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const slug = generateSlug(formData.coupleName1, formData.coupleName2)
    setGeneratedSlug(slug)
    setStep('success')
  }

  const handleFilesAdded = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }))
  }

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

  if (step === 'success') {
    return (
      <SuccessState
        couple={`${formData.coupleName1} & ${formData.coupleName2}`}
        slug={generatedSlug}
        fileCount={formData.files.length}
        onBackToDashboard={() => router.push('/admin/dashboard')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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
              {/* Couple Names */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coupleName1">Partner 1 Name *</Label>
                  <Input
                    id="coupleName1"
                    placeholder="e.g., Abel"
                    value={formData.coupleName1}
                    onChange={(e) =>
                      setFormData({ ...formData, coupleName1: e.target.value })
                    }
                    required
                    className="border-primary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coupleName2">Partner 2 Name *</Label>
                  <Input
                    id="coupleName2"
                    placeholder="e.g., Selam"
                    value={formData.coupleName2}
                    onChange={(e) =>
                      setFormData({ ...formData, coupleName2: e.target.value })
                    }
                    required
                    className="border-primary/30"
                  />
                </div>
              </div>

              {/* Wedding Date */}
              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding Date *</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, weddingDate: e.target.value })
                  }
                  required
                  className="border-primary/30"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Gallery Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a welcome message or theme for the gallery..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="border-primary/30 min-h-24"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Wedding Photos *</Label>
                <FileUploadArea onFilesAdded={handleFilesAdded} />
                {formData.files.length > 0 && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-3">
                      {formData.files.length} file{formData.files.length !== 1 ? 's' : ''} added
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {formData.files.map((file, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square bg-background rounded-lg overflow-hidden"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg"
                          >
                            <span className="text-white text-xs font-semibold">Remove</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!formData.coupleName1 || !formData.coupleName2 || !formData.weddingDate || formData.files.length === 0}
              >
                Create Gallery
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
