import Link from 'next/link'

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{
        backgroundColor: '#fdf8f2',
        background: 'radial-gradient(ellipse at 50% 40%, #f5e6c8 0%, #fdf8f2 65%)',
      }}
    >
      <div className="text-center max-w-xl mx-auto">
        <h1
          className="text-5xl md:text-6xl font-serif font-bold mb-4 leading-tight"
          style={{ color: '#2c1810' }}
        >
          QR Wedding Gallery
        </h1>

        <div className="flex justify-center mb-6">
          <div className="h-0.5 w-16 rounded-full bg-amber-300" />
        </div>

        <p
          className="text-lg md:text-xl leading-relaxed mb-10 mx-auto max-w-md"
          style={{ color: '#a0856c' }}
        >
          Capture and share your wedding memories with elegant, QR-powered galleries. Perfect for Ethiopian wedding studios.
        </p>

        <Link href="/admin/login">
          <button
            className="px-8 py-3 rounded-full text-white font-semibold text-base transition-colors duration-200 hover:opacity-90"
            style={{ backgroundColor: '#8b6914' }}
          >
            Studio Sign In
          </button>
        </Link>
      </div>
    </div>
  )
}
