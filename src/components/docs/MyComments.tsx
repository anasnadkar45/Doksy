import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import type { Comment } from "./documentation-viewer"
import { Button } from "../ui/button"
import { MessageSquare } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import CommentCard from "./CommentCard"

const MyComments = ({ comments, slug }: { comments: Comment[]; slug: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <MessageSquare className="h-4 w-4" />
          My Comments
          {comments.length > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {comments.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-3">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            My Comments
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            View and manage all your comments on this documentation page. You can delete your own comments at any time.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4">
          {comments.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} slug={slug} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">No comments yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                You haven't made any comments on this page yet. Start engaging with the documentation by adding your
                first comment!
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MyComments
