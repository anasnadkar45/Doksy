"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, Plus, ArrowLeft, Globe, FileText, Loader } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import Settings from "./settings"
import DynamicMilkdownEditor from "./dynamic-milkdown-editor"
import SidebarEditor from "./sidebar-editor-milkdown"
import { ScrollArea } from "../ui/scroll-area"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  order: number
}

export interface Project {
  id: string
  name: string
  description: string | null
  liveUrl: string | null
  creator: string | null
  slug: string
  isPublished: boolean
  githubUrl: string
  pages: Page[]
}

interface ProjectEditorProps {
  project: Project
}

export default function ProjectEditor({ project: initialProject }: ProjectEditorProps) {
  const [project, setProject] = useState(initialProject)
  const [pages, setPages] = useState<Page[]>(initialProject.pages || [])
  const [newPageInput, setNewPageInput] = useState("")
  const [currentPage, setCurrentPage] = useState<Page | null>(pages[0] || null)
  const [saving, setSaving] = useState(false)
  const [isSavingNewPage, setIsSavingNewPage] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedContentRef = useRef<string>("")

  const scheduleAutoSave = (page: Page) => {
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current)
    if (page.content !== lastSavedContentRef.current) {
      autoSaveTimeoutRef.current = setTimeout(async () => {
        if (!page) return
        setAutoSaving(true)
        try {
          const response = await fetch(`/api/projects/${project.slug}/pages/${page.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: page.title, content: page.content }),
          })
          if (!response.ok) throw new Error("Failed to save page")
          lastSavedContentRef.current = page.content
          // toast.success("Page saved")
        } catch (error) {
          console.error("Error saving page:", error)
          // toast.error("Failed to save page")
        } finally {
          setAutoSaving(false)
        }
      }, 2000)
    }
  }

  useEffect(() => {
    if (currentPage) {
      lastSavedContentRef.current = currentPage.content
    }
  }, [currentPage]) // only when switching documents

  const savePage = async (page: Page) => {
    if (!page) return
    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${project.slug}/pages/${page.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: page.title, content: page.content }),
      })
      if (!response.ok) throw new Error("Failed to save page")
      lastSavedContentRef.current = page.content
      toast.success("Page saved")
    } catch (error) {
      console.error("Error saving page:", error)
      toast.error("Failed to save page")
    } finally {
      setSaving(false)
    }
  }

  const updatePageContent = (content: string) => {
    if (!currentPage) return
    const updatedPage = { ...currentPage, content }
    setCurrentPage(updatedPage)
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)))
    scheduleAutoSave(updatedPage)
  }

  const updatePageTitle = (title: string) => {
    if (!currentPage) return
    const updatedPage = { ...currentPage, title }
    setCurrentPage(updatedPage)
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)))
    // Optional: schedule save for title edits as well
    scheduleAutoSave(updatedPage)
  }

  const handlePageSelect = async (next: Page | null) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    if (currentPage && currentPage.content !== lastSavedContentRef.current) {
      await savePage(currentPage)
    }
    setCurrentPage(next)
  }

  const addNewPage = async () => {
    if (!newPageInput) return
    const slug = newPageInput
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
    try {
      setIsSavingNewPage(true)
      const response = await fetch(`/api/projects/${project.slug}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newPageInput, slug, content: "" }),
      })
      if (!response.ok) throw new Error("Failed to create page")
      const { page } = await response.json()
      setPages((prev) => [...prev, page])
      setCurrentPage(page)
      setNewPageInput("")
      toast.success("Page created")
    } catch (error) {
      setNewPageInput("")
      console.error("Error creating page:", error)
      toast.error("Failed to create page")
    }finally{
      setIsSavingNewPage(false)
    }
  }

  const publishProject = async () => {
    setPublishing(true)
    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, isPublished: !project.isPublished }),
      })
      if (!response.ok) throw new Error("Failed to update project")
      const { project: updatedProject } = await response.json()
      setProject(updatedProject)
      toast.success(updatedProject.isPublished ? "Project published!" : "Project unpublished")
    } catch (error) {
      console.error("Error publishing project:", error)
      toast.error("Failed to update project")
    } finally {
      setPublishing(false)
    }
  }

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current)
    }
  }, [])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold">{project.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={project.isPublished ? "default" : "secondary"}>
                    {project.isPublished ? "Published" : "Draft"}
                  </Badge>
                  {autoSaving && (
                    <div className="flex items-center gap-1 text-xs">
                      <Loader className="h-3 w-3 animate-spin" />
                      Saving...
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => currentPage && savePage(currentPage)}
                disabled={saving || !currentPage}
                title="Save current page"
              >
                {saving ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              <Settings project={project} setProject={setProject} />
              {project.isPublished && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/docs/${project.slug}`} target="_blank">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Link>
                </Button>
              )}
              <Button onClick={publishProject} disabled={publishing}>
                {publishing ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                {project.isPublished ? "Unpublish" : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="w-[250px] border-r flex flex-col min-h-0">
          <div className="flex items-center justify-between p-3 pb-0">
            <h1 className="text-lg">Pages</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add new page</DialogTitle>
                  {/* <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription> */}
                </DialogHeader>
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input
                    type="text"
                    placeholder="Inter page title"
                    name="newPageInput"
                    value={newPageInput}
                    onChange={(e) => setNewPageInput(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                  <Button onClick={addNewPage}>
                    {isSavingNewPage ? "Saving..":"Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
          <div className="p-0 flex-1 min-h-0">
            <SidebarEditor
              pages={pages}
              currentPage={currentPage}
              onPageSelect={handlePageSelect}
              onPagesUpdate={setPages}
              projectSlug={project.slug}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0 ">
          {currentPage ? (
            <DynamicMilkdownEditor
              docKey={currentPage.id}
              content={currentPage.content}
              onChange={updatePageContent}
              placeholder="Enter your content here..."
              className="w-full min-h-[60vh] overflow-hidden rounded-br-2xl"
            />
          ) : (
            <div>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No page selected</h3>
                <p className="mb-4">Select a page from the sidebar to start editing, or create a new page.</p>
                <Button onClick={addNewPage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Page
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
