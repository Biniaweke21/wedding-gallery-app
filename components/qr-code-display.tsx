import { Card, CardContent } from '@/components/ui/card'

interface QRCodeDisplayProps {
  slug: string
}

export function QRCodeDisplay({ slug }: QRCodeDisplayProps) {
  return (
    <Card className="border-primary/20 bg-white">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Scan to view gallery</p>
          {/* QR Code Placeholder */}
          <div className="w-48 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mx-auto flex items-center justify-center border-2 border-primary/20">
            <div className="text-center">
              <div className="text-5xl mb-2">📱</div>
              <p className="text-xs text-muted-foreground">QR Code</p>
              <p className="text-xs text-muted-foreground">(placeholder)</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-mono break-all">{slug}</p>
        </div>
      </CardContent>
    </Card>
  )
}
