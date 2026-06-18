'use client'

import { Download } from 'lucide-react'

interface QRCodeDisplayProps {
  qrDataUrl: string
  guestUrl: string
}

export function QRCodeDisplay({ qrDataUrl, guestUrl }: QRCodeDisplayProps) {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = 'gallery-qr-code.png'
    a.click()
  }

  return (
    <div
      className="rounded-2xl p-6 text-center"
      style={{ backgroundColor: '#ffffff', border: '1px solid #e8d5b0' }}
    >
      <p className="text-xs mb-4 font-medium" style={{ color: '#a0856c' }}>Scan to view gallery</p>
      <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
      <p className="text-xs mt-3 font-mono break-all" style={{ color: '#a0856c' }}>{guestUrl}</p>
      <button
        onClick={handleDownload}
        className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition hover:bg-amber-50"
        style={{ border: '1px solid #8b6914', color: '#8b6914' }}
      >
        <Download className="w-4 h-4" />
        Download QR Code
      </button>
    </div>
  )
}
