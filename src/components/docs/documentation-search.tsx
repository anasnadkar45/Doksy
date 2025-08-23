"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface Page {
  id: string
  title: string
  slug: string
  content: string
}

interface SearchResult {
  page: Page
  snippet: string
  score: number
}

interface DocumentationSearchProps {
  pages: Page[]
  onPageSelect: (pageSlug: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function DocumentationSearch({ pages, onPageSelect, isOpen, onClose }: DocumentationSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchResults = pages
      .map((page) => {
        const titleMatch = page.title.toLowerCase().includes(query.toLowerCase())
        const contentMatch = page.content.toLowerCase().includes(query.toLowerCase())

        if (!titleMatch && !contentMatch) return null

        // Extract snippet around the match
        const contentText = page.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ")
        const queryIndex = contentText.toLowerCase().indexOf(query.toLowerCase())
        const snippetStart = Math.max(0, queryIndex - 50)
        const snippetEnd = Math.min(contentText.length, queryIndex + query.length + 50)
        const snippet = contentText.slice(snippetStart, snippetEnd)

        const score = titleMatch ? 10 : 1

        return {
          page,
          snippet: queryIndex >= 0 ? `...${snippet}...` : contentText.slice(0, 100) + "...",
          score,
        }
      })
      .filter(Boolean) as SearchResult[]

    setResults(searchResults.sort((a, b) => b.score - a.score))
  }, [query, pages])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-2xl mx-4">
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="flex items-center gap-2 p-4 border-b">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none focus:ring-0 text-lg"
              autoFocus
            />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {query && results.length === 0 && (
              <div className="p-8 text-center text-gray-500">No results found for "{query}"</div>
            )}

            {results.map((result) => (
              <button
                key={result.page.id}
                onClick={() => {
                  onPageSelect(result.page.slug)
                  onClose()
                }}
                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">{result.page.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{result.snippet}</div>
              </button>
            ))}
          </div>

          {!query && (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start typing to search through the documentation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
