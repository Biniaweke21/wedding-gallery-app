import LogoutButton from '@/components/logout-button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#fafaf9', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e8d5b0' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-serif font-bold" style={{ color: '#8b6914' }}>
            {process.env.STUDIO_ID}
          </span>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  )
}
