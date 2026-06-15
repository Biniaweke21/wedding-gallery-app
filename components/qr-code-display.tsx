'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
    <Card className="border-primary/20 bg-white">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Scan to view gallery</p>
          <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
          <p className="text-xs text-muted-foreground mt-4 font-mono break-all">{guestUrl}</p>
          <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
