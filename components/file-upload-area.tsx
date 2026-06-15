import { useRef } from 'react'
import { Upload } from 'lucide-react'

interface FileUploadAreaProps {
  onFilesAdded: (files: File[]) => void
}

export function FileUploadArea({ onFilesAdded }: FileUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )
    onFilesAdded(files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    onFilesAdded(files)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
    >
      <Upload className="w-12 h-12 text-primary/60 mx-auto mb-3" />
      <p className="text-foreground font-medium mb-1">Drag photos here or click to upload</p>
      <p className="text-sm text-muted-foreground">JPG, PNG, WebP up to 10MB each</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
