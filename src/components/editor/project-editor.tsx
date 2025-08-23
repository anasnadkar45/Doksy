"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DynamicTiptapEditor from "./dynamic-tiptap-editor"
import SidebarEditor from "./sidebar-editor"
import { Save, Eye, Settings, Plus, ArrowLeft, Globe, FileText, Loader } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  order: number
}

interface Project {
  id: string
  name: string
  description: string | null
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
  const [currentPage, setCurrentPage] = useState<Page | null>(pages[0] || null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const router = useRouter()

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedContentRef = useRef<string>("")

  const scheduleAutoSave = (page: Page) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Only schedule auto-save if content has actually changed
    if (page.content !== lastSavedContentRef.current) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        savePage(page)
      }, 2000)
    }
  }

  useEffect(() => {
    if (currentPage) {
      lastSavedContentRef.current = currentPage.content
    }
  }, [currentPage]) // Only when page ID changes, not content

  const savePage = async (page: Page) => {
    if (!page) return

    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${project.slug}/pages/${page.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          content: page.content,
        }),
      })

      if (!response.ok) throw new Error("Failed to save page")

      lastSavedContentRef.current = page.content
      toast.success("Page saved successfully")
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

    // Update in pages array
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)))

    scheduleAutoSave(updatedPage)
  }

  const updatePageTitle = (title: string) => {
    if (!currentPage) return

    const updatedPage = { ...currentPage, title }
    setCurrentPage(updatedPage)
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)))
  }

  const addNewPage = async () => {
    const title = prompt("Enter page title:")
    if (!title) return

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")

    try {
      const response = await fetch(`/api/projects/${project.slug}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content: "",
        }),
      })

      if (!response.ok) throw new Error("Failed to create page")

      const { page } = await response.json()
      setPages((prev) => [...prev, page])
      setCurrentPage(page)
      toast.success("Page created successfully")
    } catch (error) {
      console.error("Error creating page:", error)
      toast.error("Failed to create page")
    }
  }

  const publishProject = async () => {
    setPublishing(true)
    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...project,
          isPublished: !project.isPublished,
        }),
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className=" border-b ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold ">{project.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={project.isPublished ? "default" : "secondary"}>
                    {project.isPublished ? "Published" : "Draft"}
                  </Badge>
                  {saving && (
                    <div className="flex items-center gap-1 text-xs ">
                      <Loader className="h-3 w-3 animate-spin" />
                      Saving...
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pages</CardTitle>
                  <Button size="sm" onClick={addNewPage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <SidebarEditor
                  pages={pages}
                  currentPage={currentPage}
                  onPageSelect={setCurrentPage}
                  onPagesUpdate={setPages}
                  projectSlug={project.slug}
                />
              </CardContent>
            </Card>

            {/* Project Settings */}
            {showSettings && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Project Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Project Name</label>
                    <Input value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={project.description || ""}
                      onChange={(e) => setProject({ ...project, description: e.target.value })}
                      placeholder="Project description..."
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Save project settings
                      fetch(`/api/projects/${project.slug}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(project),
                      })
                      toast.success("Settings saved")
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            {currentPage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <Input
                      value={currentPage.title}
                      onChange={(e) => updatePageTitle(e.target.value)}
                      className="text-lg font-semibold border-none p-0 h-10 bg-transparent"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <DynamicTiptapEditor
                    content={currentPage.content}
                    onChange={updatePageContent}
                    placeholder="Start writing your documentation..."
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 " />
                  <h3 className="text-lg font-medium  mb-2">No page selected</h3>
                  <p className="mb-4">Select a page from the sidebar to start editing, or create a new page.</p>
                  <Button onClick={addNewPage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Page
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
