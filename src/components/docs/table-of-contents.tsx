"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")

    const items: TocItem[] = Array.from(headings).map((heading, index) => {
      const id = heading.id || `heading-${index}`
      if (!heading.id) {
        heading.id = id
      }

      return {
        id,
        text: heading.textContent || "",
        level: Number.parseInt(heading.tagName.charAt(1)),
      }
    })

    setTocItems(items)

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -35% 0%" },
    )

    // Observe headings in the actual DOM
    setTimeout(() => {
      const actualHeadings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      actualHeadings.forEach((heading) => observer.observe(heading))
    }, 100)

    return () => observer.disconnect()
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (tocItems.length === 0) return null

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-sm">On This Page</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="space-y-1">
          {tocItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => scrollToHeading(item.id)}
              className={`w-full justify-start text-left h-auto py-1 px-4 ${
                activeId === item.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""
              }`}
              style={{ paddingLeft: `${(item.level - 1) * 12 + 16}px` }}
            >
              <span className="text-xs truncate">{item.text}</span>
            </Button>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}
