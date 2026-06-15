import { Card, CardContent } from '@/components/ui/card'

interface Comment {
  id: number
  name: string
  message: string
  timestamp: string
}

interface CommentFeedProps {
  comments: Comment[]
}

export function CommentFeed({ comments }: CommentFeedProps) {
  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <Card className="border-primary/20 bg-white">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Be the first to share your wishes!</p>
          </CardContent>
        </Card>
      ) : (
        comments.map((comment) => (
          <Card key={comment.id} className="border-primary/20 bg-white">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{comment.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{comment.name}</p>
                  <p className="text-foreground mt-1 text-pretty break-words">{comment.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(comment.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
