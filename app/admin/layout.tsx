import LogoutButton from '@/components/logout-button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'var(--color-parchment)', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-sand)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>
            {process.env.STUDIO_ID}
          </span>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  )
}
