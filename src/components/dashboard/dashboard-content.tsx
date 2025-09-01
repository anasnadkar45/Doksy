"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import RepoSelector from "./repo-selector"
import ProjectList from "./project-list"
import DashboardStats from "./dashboard-stats"
import Plus from "../../../public/Icons/Plus"
import { AnimatePresence } from "framer-motion"

interface User {
  id: string
  name?: string
  email?: string
  image?: string
}

interface DashboardContentProps {
  user: User
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [showRepoSelector, setShowRepoSelector] = useState(false)

  return (
    <div className="min-h-full">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">

        {/* Stats */}
        <DashboardStats />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Your Projects</h3>
            <Button onClick={() => setShowRepoSelector(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Project
            </Button>
          </div>
        </div>

        {/* Repository Selector Modal */}
        <AnimatePresence>
          {showRepoSelector && <RepoSelector onClose={() => setShowRepoSelector(false)} />}
        </AnimatePresence>

        {/* Projects List */}
        <ProjectList />
      </main>
    </div>
  )
}
