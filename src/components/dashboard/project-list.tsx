"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Edit, Eye, Loader, BookOpen, Globe, Trash } from "lucide-react"
import Link from "next/link"
import PublishDialog from "./publish-dialog"
import { toast } from "sonner"

interface Project {
  id: string
  name: string
  description: string | null
  slug: string
  isPublished: boolean
  githubUrl: string
  createdAt: string
  updatedAt: string
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [publishingProject, setPublishingProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")

      const data = await response.json()
      setProjects(data.projects)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: projectId
          })
        },

      )

      if (!response.ok) {
        toast.error("Failed to delete the project")
      }

      toast.success("Project deleted successfully")
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading projects...</span>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p>Create your first documentation project from a GitHub repository.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                  )}
                </div>
                <Badge variant={project.isPublished ? "default" : "secondary"}>
                  {project.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Updated {new Date(project.updatedAt).toLocaleDateString()}</div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  {project.isPublished && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/docs/${project.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setPublishingProject(project)}>
                    <Globe className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/projects/${project.slug}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant={"destructive"} onClick={() => handleDeleteProject(project.id)} disabled={loading}>
                    {!isDeleting ? <Trash /> : <Loader className="animate-spin"/>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Publish Dialog */}
      {publishingProject && (
        <PublishDialog
          project={publishingProject}
          onClose={() => setPublishingProject(null)}
          onUpdate={handleProjectUpdate}
        />
      )}
    </>
  )
}
