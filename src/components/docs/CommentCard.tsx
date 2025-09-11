"use client"

import { useState } from "react"
import type { Comment } from "./documentation-viewer"
import { authClient } from "@/app/lib/auth-client"
import { Button } from "../ui/button"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "../ui/card"

const CommentCard = ({ comment, slug }: { comment: Comment; slug: string }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { data: session } = authClient.useSession()
  const router = useRouter()

  const handleDelete = async () => {
    if (comment.userId !== session?.user.id) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/docs/${slug}/comment`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId: comment.id,
        }),
      })

      if (response.ok) {
        toast.success("Comment Deleted")
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error(error as string)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="mb-3 border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              {comment.userId === session?.user.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  {isDeleting ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Trash className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>

            <div className="text-sm text-foreground leading-relaxed">{comment.message}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CommentCard
