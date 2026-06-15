import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Share2 } from 'lucide-react'

interface SuccessStateProps {
  couple: string
  slug: string
  fileCount: number
  onBackToDashboard: () => void
}

export function SuccessState({
  couple,
  slug,
  fileCount,
  onBackToDashboard,
}: SuccessStateProps) {
  const galleryUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://studio.com'}/${slug}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto w-full">
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="pt-12 pb-12 text-center">
            {/* Success Icon */}
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Gallery Created!</h2>
            <p className="text-muted-foreground mb-8">
              Your wedding gallery for {couple} has been successfully created with {fileCount} photo
              {fileCount !== 1 ? 's' : ''}.
            </p>

            {/* Gallery URL */}
            <div className="mb-8 p-6 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Gallery URL</p>
              <p className="font-mono text-sm text-foreground break-all mb-3">{galleryUrl}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(galleryUrl)
                }}
                className="w-full"
              >
                Copy URL
              </Button>
            </div>

            {/* QR Code Placeholder */}
            <div className="mb-8 p-6 bg-white rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-4">QR Code</p>
              <div className="w-48 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mx-auto flex items-center justify-center mb-4 border-2 border-primary/20">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-xs text-muted-foreground">QR Code</p>
                  <p className="text-xs text-muted-foreground">(placeholder)</p>
                </div>
              </div>
              <Button className="w-full gap-2" variant="outline">
                <Download className="w-4 h-4" />
                Download QR Code
              </Button>
            </div>

            {/* Share Section */}
            <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-foreground mb-3">Share with Guests</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" size="sm">
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="flex-1 gap-2" size="sm">
                  <Share2 className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onBackToDashboard}>
                Back to Dashboard
              </Button>
              <Button className="flex-1">View Live Gallery</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
