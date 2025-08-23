"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Github, BookOpen, ChevronRight, Search, Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

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

const escapeHtml = (text: string) => {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

export default function DocumentationViewer({ project, currentPage }: DocumentationViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const filteredPages = project.pages.filter((page) => page.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const navigateToPage = (pageSlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageSlug)
    router.push(`/docs/${project.slug}?${params.toString()}`)
    setSidebarOpen(false)
  }

  const isHtmlContent = (content: string) => {
    return (
      content.includes("<") &&
      content.includes(">") &&
      (content.includes("<p") ||
        content.includes("<div") ||
        content.includes("<img") ||
        content.includes("<h1") ||
        content.includes("<h2") ||
        content.includes("<h3"))
    )
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const processHtmlContent = (htmlContent: string) => {
    console.log("[v0] Processing HTML content:", htmlContent.substring(0, 200) + "...")

    let processedContent = htmlContent

    // Find and replace code blocks using regex patterns
    const codeBlockPatterns = [
      /<pre[^>]*><code[^>]*class="[^"]*language-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
      /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
      /<code[^>]*class="[^"]*language-(\w+)[^"]*"[^>]*>([\s\S]*?)<\/code>/gi,
    ]

    let blockIndex = 0
    codeBlockPatterns.forEach((pattern, patternIndex) => {
      processedContent = processedContent.replace(pattern, (match, lang, code) => {
        // Handle different capture groups based on pattern
        let language = "text"
        let codeText = ""

        if (patternIndex === 0) {
          // Pattern with language class
          language = lang || "text"
          codeText = code || ""
        } else if (patternIndex === 1) {
          // Pattern without language class
          language = "text"
          codeText = lang || "" // In this case, lang is actually the code content
        } else {
          // Inline code with language
          language = lang || "text"
          codeText = code || ""
        }

        // Clean up the code text
        codeText = codeText
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .trim()

        // Skip if it's likely inline code (short and no newlines)
        if (codeText.length < 10 && !codeText.includes("\n")) {
          return match
        }

        console.log("[v0] Processing code block:", {
          language,
          textLength: codeText.length,
          text: codeText.substring(0, 50) + "...",
        })

        // Create enhanced code block HTML string
        const escapedCode = codeText
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")

        const enhancedBlock = `
          <div class="enhanced-code-block relative group mb-6 rounded-xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50" data-language="${language}" data-code="${escapedCode}" data-index="${blockIndex}">
            <div class="flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 px-4 py-3 border-b border-gray-200/50 dark:border-gray-600/50">
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-600/50 px-2 py-1 rounded-md">
                ${language}
              </span>
              <button 
                class="copy-btn opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-600/50 rounded-md flex items-center justify-center"
                data-code="${escapedCode}"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
            <div class="code-content bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 overflow-x-auto">
              <pre class="text-sm leading-relaxed"><code>${escapedCode}</code></pre>
            </div>
          </div>
        `

        blockIndex++
        return enhancedBlock
      })
    })

    console.log("[v0] Processed HTML result:", processedContent.substring(0, 200) + "...")
    return processedContent
  }

  useEffect(() => {
    if (isHtmlContent(currentPage.content)) {
      setTimeout(() => {
        const copyButtons = document.querySelectorAll(".copy-btn")
        console.log("[v0] Found copy buttons:", copyButtons.length)

        copyButtons.forEach((button) => {
          const codeText = button.getAttribute("data-code") || ""

          // Remove existing listeners to prevent duplicates
          const newButton = button.cloneNode(true) as HTMLElement
          button.parentNode?.replaceChild(newButton, button)

          newButton.addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText(codeText)
              console.log("[v0] Copied code to clipboard")
              newButton.innerHTML = `
                <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              `
              setTimeout(() => {
                newButton.innerHTML = `
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2v8a2 2 0 002 2z"></path>
                  </svg>
                `
              }, 2000)
            } catch (err) {
              console.error("Failed to copy text: ", err)
            }
          })
        })
      }, 100)
    }
  }, [currentPage.content])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Documentation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl transform transition-all duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 lg:hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Navigation
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredPages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => navigateToPage(page.slug)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group shadow-sm ${
                      currentPage.id === page.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-blue-900/20 hover:shadow-md hover:transform hover:scale-[1.01]"
                    }`}
                  >
                    <span className="truncate">{page.title}</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-all duration-200 ${
                        currentPage.id === page.id
                          ? "opacity-100 transform rotate-90"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-purple-50/30 dark:from-gray-800/50 dark:to-purple-900/20">
              <div className="text-xs text-gray-500 dark:text-gray-400">
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
                  <Link href="/" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    Doksy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Doksy
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 dark:text-white font-medium">{project.name}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">{currentPage.title}</span>
            </nav>

            <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                {currentPage.title}
              </h1>
              {project.description && (
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{project.description}</p>
              )}
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert bg-white/50 dark:bg-gray-800/30 rounded-2xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              {isHtmlContent(currentPage.content) ? (
                <div
                  className="tiptap-content"
                  dangerouslySetInnerHTML={{ __html: processHtmlContent(currentPage.content) }}
                  style={
                    {
                      "--tiptap-color": "rgb(55 65 81)",
                      "--tiptap-color-dark": "rgb(209 213 219)",
                    } as React.CSSProperties
                  }
                />
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ node, inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || "")
                      const codeString = String(children).replace(/\n$/, "")

                      if (!inline && match) {
                        return (
                          <div className="relative group mb-6 rounded-xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 px-4 py-3 border-b border-gray-200/50 dark:border-gray-600/50">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-600/50 px-2 py-1 rounded-md">
                                {match[1]}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(codeString)}
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-600/50"
                              >
                                {copiedCode === codeString ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <SyntaxHighlighter
                              style={tomorrow}
                              language={match[1]}
                              PreTag="div"
                              className="!mt-0 !rounded-none"
                              customStyle={{
                                margin: 0,
                                borderRadius: 0,
                                background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                              }}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        )
                      }

                      return (
                        <code
                          className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 px-2 py-1 rounded-md text-sm font-mono text-pink-700 dark:text-pink-300 border border-pink-200/50 dark:border-pink-700/50"
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                    h1: ({ children }: any) => (
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6 mt-8 first:mt-0 pb-3 border-b-2 border-gradient-to-r from-blue-500 to-purple-500">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }: any) => (
                      <h2 className="text-3xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4 mt-8 pb-2 border-b border-gray-300/50 dark:border-gray-600/50">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }: any) => (
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">{children}</h3>
                    ),
                    h4: ({ children }: any) => (
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4">{children}</h4>
                    ),
                    p: ({ children }: any) => (
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-8 text-base">{children}</p>
                    ),
                    ul: ({ children }: any) => (
                      <ul className="mb-6 space-y-2 text-gray-700 dark:text-gray-300">{children}</ul>
                    ),
                    ol: ({ children }: any) => (
                      <ol className="mb-6 space-y-2 text-gray-700 dark:text-gray-300 list-decimal pl-6">{children}</ol>
                    ),
                    li: ({ children }: any) => (
                      <li className="ml-6 relative">
                        <span className="absolute -left-4 top-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                        <div className="leading-7">{children}</div>
                      </li>
                    ),
                    blockquote: ({ children }: any) => (
                      <blockquote className="border-l-4 border-gradient-to-b from-blue-500 to-purple-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 pl-6 py-4 mb-6 italic text-gray-700 dark:text-gray-300 rounded-r-xl shadow-sm">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }: any) => (
                      <a
                        href={href}
                        className="text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 hover:underline font-medium transition-colors duration-200"
                        target={href?.startsWith("http") ? "_blank" : undefined}
                        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }: any) => (
                      <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                        <table className="min-w-full">{children}</table>
                      </div>
                    ),
                    thead: ({ children }: any) => (
                      <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                        {children}
                      </thead>
                    ),
                    th: ({ children }: any) => (
                      <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200/50 dark:border-gray-700/50">
                        {children}
                      </th>
                    ),
                    td: ({ children }: any) => (
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-700/50">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {currentPage.content}
                </ReactMarkdown>
              )}
            </div>

            <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
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
                          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-700/50 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
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
                          className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200/50 dark:border-purple-700/50 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200"
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
        </main>
      </div>

      <style jsx global>{`
        .tiptap-content {
          color: var(--tiptap-color);
        }
        
        .dark .tiptap-content {
          color: var(--tiptap-color-dark);
        }
        
        .tiptap-content .tiptap-paragraph {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        
        .tiptap-content .tiptap-heading {
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .dark .tiptap-content .tiptap-heading {
          background: linear-gradient(135deg, #f9fafb 0%, #d1d5db 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .tiptap-content .tiptap-image {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem 0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(229, 231, 235, 0.5);
        }
        
        .dark .tiptap-content .tiptap-image {
          border: 1px solid rgba(75, 85, 99, 0.5);
        }
        
        .tiptap-content .tiptap-link {
          color: rgb(37 99 235);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .tiptap-content .tiptap-link:hover {
          color: rgb(147 51 234);
          text-decoration: underline;
        }
        
        .dark .tiptap-content .tiptap-link {
          color: rgb(96 165 250);
        }
        
        .dark .tiptap-content .tiptap-link:hover {
          color: rgb(196 181 253);
        }
        
        .tiptap-content ul, .tiptap-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .tiptap-content li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }

        /* Enhanced syntax highlighter styling */
        .prose pre {
          background: transparent !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .prose code {
          background: transparent !important;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }

        .dark ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
        }
      `}</style>
    </div>
  )
}
