'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CommentFormProps {
  onSubmit: (name: string, message: string) => void
  disabled?: boolean
}

export function CommentForm({ onSubmit, disabled = false }: CommentFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && message.trim()) {
      onSubmit(name, message)
      setName('')
      setMessage('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  if (disabled) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive font-medium">This gallery has expired and no longer accepts comments</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-white">
      <CardHeader>
        <CardTitle className="text-xl">Leave Your Wishes</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-primary/30"
            />
          </div>
          <div>
            <Textarea
              placeholder="Share your wishes and memories..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="border-primary/30 min-h-24"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!name.trim() || !message.trim()}>
            Send Wishes
          </Button>
          {submitted && (
            <p className="text-sm text-emerald-600 text-center">✓ Thank you for your wishes!</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
