"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Search, Star, ExternalLink, Loader } from "lucide-react"
import type { GitHubRepo } from "@/app/lib/github"
import { toast } from "sonner"

interface RepoSelectorProps {
  onClose: () => void
}

export default function RepoSelector({ onClose }: RepoSelectorProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchRepos()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = repos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredRepos(filtered)
    } else {
      setFilteredRepos(repos)
    }
  }, [searchQuery, repos])

  const fetchRepos = async () => {
    try {
      const response = await fetch("/api/github/repos")
      if (!response.ok) throw new Error("Failed to fetch repositories")

      const data = await response.json()
      setRepos(data.repos)
      setFilteredRepos(data.repos)
    } catch (error) {
      console.error("Error fetching repos:", error)
      toast.error("Failed to fetch repositories")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!selectedRepo) return

    setCreating(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoId: selectedRepo.id,
          repoName: selectedRepo.name,
          repoOwner: selectedRepo.owner.login,
          repoUrl: selectedRepo.html_url,
          name: selectedRepo.name,
          description: selectedRepo.description,
        }),
      })

      if (!response.ok) throw new Error("Failed to create project")

      const project = await response.json()
      toast.success("Project created successfully!")
      onClose()
      // Redirect to project editor
      window.location.href = `/projects/${project.project.slug}/edit`
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Failed to create project")
    } finally {
      setCreating(false)
    }
  }

  console.log(repos)

  return (
    <div className="fixed inset-0 bg-[#000000a3] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl backdrop-blur-lg bg-opacity-50 h-fit overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Select a Repository</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {/* Search */}
          <div className="p-6 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Repository List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading repositories...</span>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchQuery
                  ? "No repositories found matching your search."
                  : "No repositories with README files found."}
              </div>
            ) : (
              <div className="divide-y">
                {filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className={`p-4 hover:bg-secondary/30 cursor-pointer transition-colors ${
                      selectedRepo?.id === repo.id ? "bg-sidebar border-l-4" : ""
                    }`}
                    onClick={() => setSelectedRepo(repo)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{repo.name}</h3>
                          {repo.private && <Badge variant="secondary">Private</Badge>}
                          {repo.language && (
                            <Badge variant="outline" className="text-xs">
                              {repo.language}
                            </Badge>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{repo.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {repo.stargazers_count}
                          </div>
                          <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-sidebar">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {selectedRepo ? `Selected: ${selectedRepo.name}` : "Select a repository to continue"}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={!selectedRepo || creating}>
                  {creating ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
