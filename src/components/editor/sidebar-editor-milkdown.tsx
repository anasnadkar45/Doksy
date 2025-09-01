"use client"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Edit2, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react"
import { toast } from "sonner"
import { Search } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  order: number
  parentId?: string | null
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
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pages
    return pages.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
  }, [pages, query])

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
        body: JSON.stringify({ title: editTitle, content: page.content }),
      })
      if (!response.ok) throw new Error("Failed to update page")
      const updatedPages = pages.map((p) => (p.id === page.id ? { ...p, title: editTitle } : p))
      onPagesUpdate(updatedPages)
      if (currentPage?.id === page.id) onPageSelect({ ...page, title: editTitle })
      toast.success("Page title updated")
    } catch {
      toast.error("Failed to update page title")
    } finally {
      setEditingPage(null)
    }
  }

  const deletePage = async (page: Page) => {
    if (!confirm(`Are you sure you want to delete "${page.title}"?`)) return
    try {
      const response = await fetch(`/api/projects/${projectSlug}/pages/${page.slug}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete page")
      const updatedPages = pages.filter((p) => p.id !== page.id)
      onPagesUpdate(updatedPages)
      if (currentPage?.id === page.id) onPageSelect(updatedPages[0] || (null as any))
      toast.success("Page deleted")
    } catch {
      toast.error("Failed to delete page")
    }
  }

  // Local helpers for ordering; persist with a reorder endpoint if available.
  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= pages.length) return
    const copy = [...pages]
    const [item] = copy.splice(index, 1)
    copy.splice(next, 0, item)
    // Re-number order locally
    const reOrdered = copy.map((p, i) => ({ ...p, order: i }))
    onPagesUpdate(reOrdered)
  }

  // Placeholder indent/outdent (UI only; requires backend to persist parentId/order)
  const indent = (page: Page) => {
    // No-op persist; just a toast indicating future support
    toast.message("Indent", { description: "Nesting will be saved once backend supports parentId updates." })
  }
  const outdent = (page: Page) => {
    toast.message("Outdent", { description: "Nesting will be saved once backend supports parentId updates." })
  }

  return (
    <div className="space-y-2 flex h-full min-h-0 flex-col">
      <div className="px-3 pt-3">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages..."
            className="pl-8 h-8 bg-muted/50"
          />
          <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Make the scroll area take available height and scroll on overflow.
          Move spacing to an inner div to keep consistent gaps between items. */}
      <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-1">
          {filtered.map((page, index) => (
            <div
              key={page.id}
              className={`group flex items-center gap-2 p-2 cursor-pointer hover:bg-sidebar-accent/40 border-l-2 transition-colors ${
                currentPage?.id === page.id ? "bg-sidebar-accent/50 border-sidebar-primary font-bold" : "border-transparent text-muted-foreground"
              }`}
              onClick={() => onPageSelect(page)}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {editingPage === page.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => saveTitle(page)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveTitle(page)
                      if (e.key === "Escape") setEditingPage(null)
                    }}
                    className="h-7 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium truncate max-w-[90px] line-clamp-1">{page.title}</span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    move(index, -1)
                  }}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    move(index, +1)
                  }}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
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
      </ScrollArea>
    </div>
  )
}
