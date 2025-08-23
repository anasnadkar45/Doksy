"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import CloudUpload from "../../../public/Icons/Publish"
import BookOpen from "../../../public/Icons/Book"
import File from "../../../public/Icons/Page"
import AppStack from "../../../public/Icons/Draft"

interface Stats {
  totalProjects: number
  publishedProjects: number
  totalPages: number
  draftProjects: number
}

interface RecentProject {
  id: string
  name: string
  slug: string
  isPublished: boolean
  updatedAt: string
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")

      const data = await response.json()
      setStats(data.stats)
      setRecentActivity(data.recentActivity)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-card rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-card rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-b-0 rounded-b-none md:border-r-0 md:rounded-r-none md:border-b-0 md:rounded-b-none lg:border-r-0 lg:rounded-r-none lg:border-b lg:rounded-bl-xl hover:bg-card/75 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BookOpen />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">Documentation projects</p>
          </CardContent>
        </Card>

        <Card className="rounded-t-none rounded-b-none border-b-0 md:rounded-tr-xl md:rounded-l-none md:border-b-0 md:rounded-b-none lg:border-r-0 lg:rounded-r-none lg:rounded-l-none lg:border-b hover:bg-card/75 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CloudUpload />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedProjects}</div>
            <p className="text-xs text-muted-foreground">Live documentation sites</p>
          </CardContent>
        </Card>

        <Card className="rounded-t-none rounded-b-none border-b-0 md:rounded-t-none md:border-r-0 md:rounded-br-none md:rounded-bl-xl md:border-b lg:border-r-0 lg:rounded-r-none lg:rounded-l-none hover:bg-card/75 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <File />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages}</div>
            <p className="text-xs text-muted-foreground">Documentation pages</p>
          </CardContent>
        </Card>

        <Card className="rounded-t-none md:rounded-l-none md:rounded-t-none lg:rounded-l-none lg:rounded-t-xl hover:bg-card/75 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <AppStack />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftProjects}</div>
            <p className="text-xs text-muted-foreground">Unpublished projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${project.isPublished ? "bg-green-500" : "bg-yellow-500"}`} />
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-500">
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{project.isPublished ? "Published" : "Draft"}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
