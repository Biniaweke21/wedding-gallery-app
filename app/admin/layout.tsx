import LogoutButton from '@/components/logout-button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="border-b border-primary/10 bg-white px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-foreground">{process.env.STUDIO_ID}</span>
        <LogoutButton />
      </nav>
      {children}
    </div>
  )
}
