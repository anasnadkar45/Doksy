"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Edit2, Trash2, GripVertical } from "lucide-react"
import { toast } from "sonner"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  order: number
}

interface SidebarEditorProps {
  pages: Page[]
  currentPage: Page | null
  onPageSelect: (page: Page) => void
  onPagesUpdate: (pages: Page[]) => void
  projectSlug: string
}

export default function SidebarEditor({
  pages,
  currentPage,
  onPageSelect,
  onPagesUpdate,
  projectSlug,
}: SidebarEditorProps) {
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const startEditing = (page: Page) => {
    setEditingPage(page.id)
    setEditTitle(page.title)
  }

  const saveTitle = async (page: Page) => {
    if (!editTitle.trim()) return

    try {
      const response = await fetch(`/api/projects/${projectSlug}/pages/${page.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          content: page.content,
        }),
      })

      if (!response.ok) throw new Error("Failed to update page")

      const updatedPages = pages.map((p) => (p.id === page.id ? { ...p, title: editTitle } : p))
      onPagesUpdate(updatedPages)

      if (currentPage?.id === page.id) {
        onPageSelect({ ...page, title: editTitle })
      }

      toast.success("Page title updated")
    } catch (error) {
      console.error("Error updating page:", error)
      toast.error("Failed to update page title")
    } finally {
      setEditingPage(null)
    }
  }

  const deletePage = async (page: Page) => {
    if (!confirm(`Are you sure you want to delete "${page.title}"?`)) return

    try {
      const response = await fetch(`/api/projects/${projectSlug}/pages/${page.slug}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete page")

      const updatedPages = pages.filter((p) => p.id !== page.id)
      onPagesUpdate(updatedPages)

      if (currentPage?.id === page.id) {
        onPageSelect(updatedPages[0] || null)
      }

      toast.success("Page deleted")
    } catch (error) {
      console.error("Error deleting page:", error)
      toast.error("Failed to delete page")
    }
  }

  return (
    <div className="space-y-1">
      {pages.map((page) => (
        <div
          key={page.id}
          className={`group flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/70 border-l-2 transition-colors ${
            currentPage?.id === page.id ? "bg-muted border-primary" : "border-transparent"
          }`}
        >
          <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />

          <div className="flex-1 min-w-0" onClick={() => onPageSelect(page)}>
            {editingPage === page.id ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => saveTitle(page)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle(page)
                  if (e.key === "Escape") setEditingPage(null)
                }}
                className="h-6 text-sm"
                autoFocus
              />
            ) : (
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate line-clamp-1">{page.title}</span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                startEditing(page)
              }}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            {pages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation()
                  deletePage(page)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
