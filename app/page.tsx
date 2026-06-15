import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 text-pretty">
          QR Wedding Gallery
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 mb-12 text-pretty">
          Capture and share your wedding memories with elegant, QR-powered galleries. Perfect for Ethiopian wedding studios.
        </p>
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Link href="/admin/login">
            <Button size="lg" className="w-full sm:w-auto">
              Studio Access
            </Button>
          </Link>
          <Link href="/abel-and-selam">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Sample Gallery
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
