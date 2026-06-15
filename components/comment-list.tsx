import { Card, CardContent } from '@/components/ui/card'

interface Comment {
  id: number
  name: string
  message: string
  timestamp: string
}

interface CommentListProps {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <Card className="border-primary/20">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No comments yet</p>
          </CardContent>
        </Card>
      ) : (
        comments.map((comment) => (
          <Card key={comment.id} className="border-primary/20">
            <CardContent className="pt-6">
              <p className="font-semibold text-foreground">{comment.name}</p>
              <p className="text-sm text-muted-foreground mt-2">{comment.message}</p>
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(comment.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
