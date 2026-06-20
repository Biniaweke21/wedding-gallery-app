import Link from 'next/link'
import TibebBorder from '@/components/tibeb-border'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-parchment)' }}>
      <TibebBorder delay={0} />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-tight anim-fade-rise"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-ink)',
              animationDuration: '600ms',
              animationDelay: '200ms',
              animationFillMode: 'backwards',
              animationTimingFunction: 'ease-out',
            }}
          >
            QR Wedding Gallery
          </h1>

          <div
            className="mx-auto mt-4 mb-4 anim-scale-x"
            style={{
              width: '48px',
              height: '1px',
              backgroundColor: 'var(--color-gold)',
              transformOrigin: 'center',
              animationDuration: '400ms',
              animationDelay: '350ms',
              animationFillMode: 'backwards',
              animationTimingFunction: 'ease-out',
            }}
          />

          <p
            className="text-lg leading-relaxed max-w-md mx-auto anim-fade-rise"
            style={{
              fontFamily: 'var(--font-body)',
              color: '#a0856c',
              animationDuration: '600ms',
              animationDelay: '450ms',
              animationFillMode: 'backwards',
              animationTimingFunction: 'ease-out',
            }}
          >
            Capture and share your wedding memories with elegant, QR-powered galleries. Perfect for Ethiopian wedding studios.
          </p>

          <div
            className="mt-8 anim-fade-rise"
            style={{
              animationDuration: '600ms',
              animationDelay: '550ms',
              animationFillMode: 'backwards',
              animationTimingFunction: 'ease-out',
            }}
          >
            <Link href="/admin/login">
              <button
                className="px-8 py-3 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90"
                style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-berry)' }}
              >
                Studio Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>

      <TibebBorder delay={300} />
    </div>
  )
}
