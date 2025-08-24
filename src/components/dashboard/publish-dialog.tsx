"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Globe, Copy, ExternalLink, CheckCircle, AlertCircle, Loader } from "lucide-react"
import { toast } from "sonner"
import { ScrollArea } from "../ui/scroll-area"

interface Project {
  id: string
  name: string
  description: string | null
  slug: string
  isPublished: boolean
  githubUrl: string
}

interface PublishDialogProps {
  project: Project
  onClose: () => void
  onUpdate: (project: Project) => void
}

export default function PublishDialog({ project, onClose, onUpdate }: PublishDialogProps) {
  const [publishing, setPublishing] = useState(false)
  const [customDomain, setCustomDomain] = useState("")

  const publicUrl = `${window.location.origin}/docs/${project.slug}`

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const response = await fetch(`/api/publish/${project.slug}`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to publish")
      }

      const { project: updatedProject } = await response.json()
      onUpdate(updatedProject)
      toast.success("Project published successfully!")
    } catch (error) {
      console.error("Error publishing:", error)
      toast.error(error instanceof Error ? error.message : "Failed to publish project")
    } finally {
      setPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    setPublishing(true)
    try {
      const response = await fetch(`/api/publish/${project.slug}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to unpublish")

      const { project: updatedProject } = await response.json()
      onUpdate(updatedProject)
      toast.success("Project unpublished successfully!")
      onClose()
    } catch (error) {
      console.error("Error unpublishing:", error)
      toast.error("Failed to unpublish project")
    } finally {
      setPublishing(false)
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl)
    toast.success("URL copied to clipboard!")
  }

  return (
    <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-fit max-h-[90vh] backdrop-blur-lg bg-opacity-50 py-0">
        <ScrollArea className="h-full w-full">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Publish Documentation
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 pb-6">
            {/* Project Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <Badge variant={project.isPublished ? "default" : "secondary"}>
                  {project.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              {project.description && <p className="text-gray-600 dark:text-gray-400">{project.description}</p>}
            </div>

            {/* Publication Status */}
            {project.isPublished ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-200">Documentation is live!</span>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                  Your documentation is publicly accessible at the URL below.
                </p>
                <div className="flex items-center gap-2">
                  <Input value={publicUrl} readOnly className="bg-white dark:bg-gray-800" />
                  <Button variant="outline" size="sm" onClick={copyUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Ready to publish</span>
                </div>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Your documentation is ready to be published and made publicly accessible.
                </p>
              </div>
            )}

            {/* Custom Domain (Future Feature) */}
            <div className="space-y-2">
              <Label htmlFor="custom-domain">Custom Domain (Coming Soon)</Label>
              <Input
                id="custom-domain"
                placeholder="docs.yoursite.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                disabled
              />
              <p className="text-xs text-gray-500">Connect your own domain for a branded documentation experience.</p>
            </div>

            {/* SEO Preview */}
            <div className="space-y-2">
              <Label>SEO Preview</Label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div className="text-blue-600 dark:text-blue-400 text-sm">{publicUrl}</div>
                <div className="font-medium text-gray-900 dark:text-white">{project.name} - Documentation</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  {project.description || `Documentation for ${project.name}`}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                {project.isPublished
                  ? "Documentation is publicly accessible"
                  : "Documentation will be publicly accessible"}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {project.isPublished ? (
                  <Button variant="destructive" onClick={handleUnpublish} disabled={publishing}>
                    {publishing ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                    Unpublish
                  </Button>
                ) : (
                  <Button onClick={handlePublish} disabled={publishing}>
                    {publishing ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                    Publish Documentation
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
}
