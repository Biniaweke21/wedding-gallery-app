import { Card, CardContent } from '@/components/ui/card'

interface Photo {
  id: number
  url: string
}

interface PhotoGridProps {
  photos: Photo[]
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-square bg-secondary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <img
            src={photo.url}
            alt={`Gallery photo ${photo.id}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}
