"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CommentStatus, CommentType } from "@/generated/prisma"
import { formatDistanceToNow } from "date-fns"
import { ChevronUp, ChevronDown, Search, Filter, Loader2, Edit } from "lucide-react"
import MarkdownViewer from "@/components/docs/markdown-viewer"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Comments from "@/../public/communication.svg"

type Comment = {
  id: string
  message: string
  page: string | null
  commentFor: string | null
  type: CommentType
  status: CommentStatus
  createdAt: Date
  User: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  } | null
}

type SortField = "createdAt" | "type" | "status" | "page" | "user"
type SortDirection = "asc" | "desc"

interface CommentsTableProps {
  id: string
  slug: string
}

const getStatusColor = (status: CommentStatus) => {
  switch (status) {
    case CommentStatus.OPEN:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case CommentStatus.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case CommentStatus.RESOLVED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getTypeColor = (type: CommentType) => {
  switch (type) {
    case CommentType.BUG:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case CommentType.TYPO:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case CommentType.SUGGESTION:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    case CommentType.UNCLEAR:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export default function CommentsPage({ project }: { project: CommentsTableProps }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<CommentStatus | "all">("all")
  const [typeFilter, setTypeFilter] = useState<CommentType | "all">("all")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalComments, setTotalComments] = useState(0)
  const [loading, setLoading] = useState(true)
  const [itemsPerPage] = useState(10)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const fetchComments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        projectId: project.id,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: debounceSearchTerm,
        status: statusFilter,
        type: typeFilter,
        sortField,
        sortDirection,
      })

      const response = await fetch(`/api/projects/${project.slug}/comments?${params}`)
      if (!response.ok) throw new Error("Failed to fetch comments")

      const data = await response.json()
      setComments(data.comments)
      setTotalPages(data.pagination.totalPages)
      setTotalComments(data.pagination.total)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateCommentStatus = async (commentId: string, newStatus: CommentStatus) => {
    setUpdatingStatus(commentId)
    try {
      const response = await fetch(`/api/projects/${project.slug}/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update comment status")

      const data = await response.json()

      // Update the comment in the local state
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? { ...comment, status: newStatus } : comment)),
      )

      // Update selected comment if it's the one being updated
      if (selectedComment?.id === commentId) {
        setSelectedComment((prev) => (prev ? { ...prev, status: newStatus } : null))
      }

      toast.success("Status updated", {
        description: `Comment status changed to ${newStatus.replace("_", " ").toLowerCase()}`,
      }
      )
    } catch (error) {
      console.error("Error updating comment status:", error)
      toast.error("Error", {
        description: "Failed to update comment status",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchTerm(searchTerm)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchTerm])
  useEffect(() => {
    fetchComments()
  }, [project.id, currentPage, debounceSearchTerm, statusFilter, typeFilter, sortField, sortDirection])

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [searchTerm, statusFilter, typeFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CommentStatus | "all")}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={CommentStatus.OPEN}>Open</SelectItem>
              <SelectItem value={CommentStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={CommentStatus.RESOLVED}>Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as CommentType | "all")}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={CommentType.BUG}>Bug</SelectItem>
              <SelectItem value={CommentType.TYPO}>Typo</SelectItem>
              <SelectItem value={CommentType.SUGGESTION}>Suggestion</SelectItem>
              <SelectItem value={CommentType.UNCLEAR}>Unclear</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {totalComments} comment{totalComments !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("user")}
                >
                  Author
                  <SortIcon field="user" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("type")}
                >
                  Type
                  <SortIcon field="type" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <SortIcon field="status" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("page")}
                >
                  Page
                  <SortIcon field="page" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("createdAt")}
                >
                  Date
                  <SortIcon field="createdAt" />
                </Button>
              </TableHead>
              <TableHead className="w-[300px]">Message Preview</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Loading comments...</p>
                </TableCell>
              </TableRow>
            ) : comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-card via-card/50 to-muted/50 rounded-xl" />
                    <Card className="relative border-0 bg-background/80 backdrop-blur-2xl">
                      <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <CardTitle className="text-3xl font-bold ">
                            No comments yet
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground max-w-2xl mx-auto">
                          This space will show all the feedback your documentation receives.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center pb-12">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted rounded-full blur-3xl scale-120" />
                          <div className="relative p-8 rounded-2xl bg-card/30 border border-border/50">
                            <Image
                              src={Comments || "/placeholder.svg"}
                              alt="Exciting features coming soon"
                              width={200}
                              height={200}
                              className="dark:invert opacity-80 hover:opacity-100 transition-opacity duration-300"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                  </div>
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow
                  key={comment.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedComment(comment)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.User?.image || undefined} />
                        <AvatarFallback>{comment.User?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{comment.User?.name || "Anonymous"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(comment.type)}>
                      {comment.type.charAt(0) + comment.type.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(comment.status)}>
                      {comment.status.replace("_", " ").toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{comment.page || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground truncate">
                      {comment.message.length > 100 ? `${comment.message.substring(0, 100)}...` : comment.message}
                    </p>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={comment.status}
                      onValueChange={(value) => updateCommentStatus(comment.id, value as CommentStatus)}
                      disabled={updatingStatus === comment.id}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        {updatingStatus === comment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CommentStatus.OPEN}>Open</SelectItem>
                        <SelectItem value={CommentStatus.IN_PROGRESS}>In Progress</SelectItem>
                        <SelectItem value={CommentStatus.RESOLVED}>Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Comment Detail Dialog */}
      <Dialog open={!!selectedComment} onOpenChange={() => setSelectedComment(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedComment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedComment.User?.image || undefined} />
                    <AvatarFallback>{selectedComment.User?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedComment.User?.name || "Anonymous"}</p>
                    <p className="text-sm text-muted-foreground font-normal">
                      {formatDistanceToNow(new Date(selectedComment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <Badge variant="outline" className={getTypeColor(selectedComment.type)}>
                      {selectedComment.type.charAt(0) + selectedComment.type.slice(1).toLowerCase()}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(selectedComment.status)}>
                      {selectedComment.status.replace("_", " ").toLowerCase()}
                    </Badge>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {selectedComment.page && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Page:</p>
                    <p className="text-sm">{selectedComment.page}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Message:</p>
                  <p className="text-sm leading-relaxed">{selectedComment.message}</p>
                </div>

                {selectedComment.commentFor && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Referenced text:</p>
                    <div className="border bg-muted/50 rounded-md p-3 overflow-auto">
                      <MarkdownViewer
                        content={selectedComment.commentFor}
                        className="text-sm [&>*]:my-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Update Status:</p>
                  <Select
                    value={selectedComment.status}
                    onValueChange={(value) => updateCommentStatus(selectedComment.id, value as CommentStatus)}
                    disabled={updatingStatus === selectedComment.id}
                  >
                    <SelectTrigger className="w-[200px]">
                      {updatingStatus === selectedComment.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CommentStatus.OPEN}>Open</SelectItem>
                      <SelectItem value={CommentStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={CommentStatus.RESOLVED}>Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
