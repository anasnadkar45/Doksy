"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Github, ChevronRight, Search, ExternalLink, UserIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import MarkdownViewer from "./markdown-viewer"
import PromotionCard from "./PromotionCard"

export interface Page {
  id: string
  title: string
  slug: string
  content?: string
  order: number
}

export interface Project {
  id: string
  name: string
  description: string | null
  liveUrl: string | null
  creator: string | null
  slug: string
  githubUrl: string
  user: {
    name: string | null
    githubUsername: string | null
  }
  pages: Page[]
}

interface DocumentationViewerProps {
  project: Project
  currentPage: Page
}

export default function DocumentationViewer({ project, currentPage }: DocumentationViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredPages = project.pages.filter((page) => page.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const navigateToPage = (pageSlug: string) => {
    router.push(`/docs/${project.slug}/${pageSlug}`)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-dashed">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href={"/"}>
              <div className="flex items-center gap-3">
                <Image src={"/Logo.svg"} alt="Doksy" width={40} height={40} loading="lazy" unoptimized />
                <div>
                  <h1 className="md:text-xl font-bold line-clamp-1">{project.name}</h1>
                  <p className="text-xs text-muted-foreground">Documentation</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant={"secondary"} asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            {project.creator && (
              <Button variant={"secondary"} asChild>
                <Link href={project.creator} target="_blank" rel="noopener noreferrer">
                  <UserIcon className="h-4 w-4 mr-1" />
                  Creator
                </Link>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild>
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-[64]">
        {/* sidebar */}
        <aside
          className={`w-72 border-r  border-dashed bg-background transition-all duration-300 lg:block ${sidebarOpen ? "block" : "hidden"
            } lg:relative fixed inset-y-0 left-0 z-40 lg:z-auto pt-0 lg:pt-0`}
        >
          <div className="p-4 bg-background border-b border-dashed">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-sm"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-11.5rem)] flex flex-col lg:flex-row mt-20 lg:mt-0">
            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {filteredPages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => navigateToPage(page.slug)}
                    className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-all duration-200 flex items-center justify-between hover:cursor-pointer group ${currentPage.id === page.id
                      ? "bg-card border font-bold border-dashed"
                      : "text-muted-foreground hover:bg-card/85"
                      }`}
                  >
                    <span className="line-clamp-1">{page.title}</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-all duration-200 ${currentPage.id === page.id
                        ? "opacity-100 transform rotate-90"
                        : "opacity-0 group-hover:opacity-100"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </nav>
          </ScrollArea>
          <div className="p-4 border-t border-dashed bg-card ">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1 mb-2">
                <span>Created by</span>
                {project.user.githubUsername ? (
                  <a
                    href={`https://github.com/${project.user.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    {project.user.name || project.user.githubUsername}
                  </a>
                ) : (
                  <span className="font-medium">{project.user.name || "Unknown"}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span>Powered by</span>
                <Link href="/" className="text-primary hover:underline font-medium">
                  Doksy
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="w-full md:flex mx-auto mb-4 md:mb-0">
          <ScrollArea className="h-fit w-full md:h-[calc(100vh-4rem)] scrollbar-hide">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <nav className="flex items-center bg-card gap-2 text-sm mb-8 p-3 border rounded-sm border-dashed">
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Doksy
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/docs/${project.slug}`} className="text-muted-foreground font-medium line-clamp-1 hover:text-foreground transition-colors">{project.name}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium line-clamp-1">{currentPage.title}</span>
              </nav>

              <div className="pb-6 space-y-1">
                <h1 className="text-4xl font-bold">{currentPage.title}</h1>
                {project.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                )}
              </div>

              <MarkdownViewer
                content={currentPage.content ?? ""}
                className="prose prose-lg max-w-none dark:prose-invert"
              />


              {/* Pagination */}
              <div className="flex justify-between items-center mt-10 pt-8 border-t">
                {(() => {
                  const currentIndex = project.pages.findIndex((page) => page.id === currentPage.id)
                  const prevPage = currentIndex > 0 ? project.pages[currentIndex - 1] : null
                  const nextPage = currentIndex < project.pages.length - 1 ? project.pages[currentIndex + 1] : null

                  return (
                    <>
                      <div>
                        {prevPage && (
                          <Button
                            variant="outline"
                            onClick={() => navigateToPage(prevPage.slug)}
                            className="max-w-[200px] overflow-hidden justify-start"
                          >
                            ← {prevPage.title}
                          </Button>
                        )}
                      </div>
                      <div>
                        {nextPage && (
                          <Button
                            variant="outline"
                            onClick={() => navigateToPage(nextPage.slug)}
                            className="max-w-[200px] overflow-hidden justify-end"
                          >
                            {nextPage.title} →
                          </Button>
                        )}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </ScrollArea>
          <PromotionCard />
        </main>
      </div>
    </div>
  )
}
