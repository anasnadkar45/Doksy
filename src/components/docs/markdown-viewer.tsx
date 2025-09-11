"use client"

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import type { PluggableList } from "unified"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSanitize from "rehype-sanitize"
import rehypePrism from "rehype-prism-plus"
import { safeSchema } from "./safe-schema"
import { Quote } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { Button, buttonVariants } from "../ui/button"
import Message from "../../../public/Icons/Message"
import Copy from "../../../public/Icons/Copy"
import CopyDone from "../../../public/Icons/CopyDone"
import { toast } from "sonner"
import type { User } from "./documentation-viewer"
import Link from "next/link"
import { CommentStatus, CommentType } from "@/generated/prisma"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { useRouter } from "next/navigation"

export type MarkdownViewerProps = {
  content: string
  projectId?: string
  canUserComment?: Boolean
  slug?: string
  pageName?: string
  user?: User
  className?: string
}

const blockLikeTags = new Set(["DIV", "PRE", "TABLE", "UL", "OL", "BLOCKQUOTE", "IMG", "HR"])

// Type-safe plugin lists
const remarkPlugins = [remarkGfm] satisfies PluggableList
const rehypePlugins = [
  rehypeRaw,
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "append" }] as const,
  [rehypeSanitize, safeSchema] as const,
  rehypePrism,
] satisfies PluggableList

export default function MarkdownViewer({ content, projectId, canUserComment, slug, pageName, user, className }: MarkdownViewerProps) {
  const remarkList = useMemo(() => remarkPlugins, [])
  const rehypeList = useMemo(() => rehypePlugins, [])
  const [selectedText, setSelectedText] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showOptions, setShowOptions] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const [comment, setComment] = useState("")
  const [commentType, setCommentType] = useState<CommentType>(CommentType.COMMENT)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [canComment, setCanComment] = useState(false)

  const router = useRouter();

  const CodeBlock: React.FC<React.HTMLAttributes<HTMLElement> & { inline?: boolean }> = ({
    inline,
    className: codeClass,
    children,
    ...props
  }) => {
    const [copied, setCopied] = useState(false)
    const onCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(String(children ?? ""))
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      } catch {
        // ignore
      }
    }, [children])

    const lang = useMemo(() => {
      const m = /language-([\w-]+)/.exec(codeClass || "")
      return m?.[1] || ""
    }, [codeClass])

    if (inline) {
      return (
        <code
          className={`w-fit rounded-full text-amber-200 bg-muted px-1.5 py-0.5 font-mono text-[0.85em] ${codeClass || ""}`}
          {...props}
        >
          {children}
        </code>
      )
    }

    return (
      <div className="relative my-4 group">
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy code to clipboard"
          className="absolute right-2.5 top-2.5 z-10 rounded border bg-background/80 px-1 py-1 text-xs text-foreground shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 opacity-0 hover:bg-background focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path stroke="currentColor" strokeWidth="2" d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path stroke="currentColor" strokeWidth="2" d="M9 9h10v10H9z" />
              <path stroke="currentColor" strokeWidth="2" d="M5 15V5h10" />
            </svg>
          )}
        </button>
        {lang ? (
          <span className="pointer-events-none absolute right-12 top-2.5 z-10 rounded bg-secondary/70 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-secondary-foreground/80">
            {lang}
          </span>
        ) : null}
        <pre
          className="overflow-auto rounded-lg border bg-secondary/10 p-4 font-mono text-sm leading-relaxed"
          tabIndex={0}
        >
          <code className={codeClass} {...props}>
            {children}
          </code>
        </pre>
      </div>
    )
  }

  const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, ...pProps }) => {
    const array = React.Children.toArray(children) as React.ReactElement[]
    const hasBlock =
      array.findIndex((child: any) => {
        if (!React.isValidElement(child)) return false
        const tag = typeof child.type === "string" ? child.type.toUpperCase() : ""
        return blockLikeTags.has(tag)
      }) !== -1
    if (hasBlock) {
      return (
        <div {...pProps} className={`my-4 leading-7 ${pProps.className || ""}`}>
          {children}
        </div>
      )
    }
    return (
      <p {...pProps} className={`my-4 leading-7 ${pProps.className || ""}`}>
        {children}
      </p>
    )
  }

  const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children }) => (
    <h1 className="mt-8 text-3xl font-semibold tracking-tight">{children}</h1>
  )
  const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children }) => (
    <h2 className="mt-8 text-2xl font-semibold tracking-tight">{children}</h2>
  )
  const H3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children }) => (
    <h3 className="mt-6 text-xl font-semibold">{children}</h3>
  )

  useEffect(() => {
    if (user?.id) {
      setCanComment(true)
    }
  }, [user])

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection()
      const text = selection?.toString()

      if (text?.trim()) {
        const range = selection?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()
        setSelectedText(text)
        setComment("") // Reset comment when new text is selected
        setPosition({
          x: (rect?.left as number) + window.scrollX,
          y: (rect?.top as number) + window.scrollY - 120,
        })
        setShowOptions(true)
      }
    }

    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const isSelectContent =
        target.closest("[data-radix-select-content]") ||
        target.closest("[data-radix-select-trigger]") ||
        target.closest("[data-radix-select-item]") ||
        target.closest("[data-radix-select-viewport]")

      if (popupRef.current && !popupRef.current.contains(event.target as Node) && !isSelectContent) {
        setShowOptions(false)
        setComment("")
        setIsCopied(false)
      }
    }

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showOptions])

  const handleComment = async () => {
    const finalComment = comment
    if (!finalComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/docs/${slug}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          message: finalComment,
          page: pageName,
          commentFor: selectedText,
          status: CommentStatus.OPEN,
          type: commentType,
          projectId,
          userId: user?.id,
        }),
      })

      if (response.ok) {
        toast.success("Comment added successfully!")
        router.refresh()
      }

      // Reset
      setComment("")
      setShowOptions(false)
      setIsCopied(false)
    } catch (error) {
      console.error("Failed to submit comment:", error)
      toast.error("Failed to add comment. Please try again.")
    } finally {
      setIsSubmitting(false)
      setIsCopied(false)
    }
  }

  const handleCancel = () => {
    setShowOptions(false)
    setComment("")
    setIsCopied(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText)
    setIsCopied(true)
  }

  const handleCommentTypeChange = (value: string) => {
    setCommentType(value as CommentType)
  }

  return (
    <div className={className}>
      <div>
        {(showOptions && canUserComment) && (
          <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div
              ref={popupRef}
              className="h-fit p-3 rounded-lg border bg-card shadow-lg flex flex-col w-fit gap-3 min-w-[300px]"
            >
              <div className="flex flex-col gap-2">
                <div className="flex w-full justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">Selected text:</div>
                  <Button size={"icon"} variant={"ghost"} onClick={handleCopy}>
                    {isCopied ? <CopyDone className="size-6" /> : <Copy className="size-6" />}
                  </Button>
                </div>
                <div className="text-sm bg-muted p-2 rounded border max-w-[400px] truncate">"{selectedText}"</div>
              </div>

              <Textarea
                value={comment}
                disabled={!canComment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment or describe the issue..."
                className="max-w-2xl max-h-[200px] overflow-auto bg-background resize-none"
                rows={3}
                autoFocus
              />

              <div className="flex gap-2 justify-between items-center">
                <Select value={commentType} onValueChange={handleCommentTypeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Comment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Comment Type</SelectLabel>
                      {Object.entries(CommentType).map(([name, type]) => (
                        <SelectItem key={type} value={type}>
                          {name.charAt(0) + name.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  {canComment ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleComment}
                      disabled={!comment.trim() || isSubmitting}
                    >
                      <Message />
                      {isSubmitting ? "Adding..." : "Add Comment"}
                    </Button>
                  ) : (
                    <Link href={"/login"} className={buttonVariants()}>
                      Login To Comment
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ReactMarkdown
        remarkPlugins={remarkList}
        rehypePlugins={rehypeList}
        components={{
          code: CodeBlock as any,
          p: Paragraph as any,
          a: ({ children, ...props }) => (
            <a
              {...props}
              className="text-primary underline underline-offset-4 hover:opacity-90"
              target={props.href?.startsWith("#") ? undefined : "_blank"}
              rel={props.href?.startsWith("#") ? undefined : "noreferrer"}
            >
              {children}
            </a>
          ),
          img: ({ alt, ...props }) => (
            <img {...props} alt={alt || ""} className="mx-auto my-4 max-w-full rounded-2xl bg-transparent" />
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto border rounded-xl border-dashed">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="border-b bg-muted/40 px-3 py-2 text-left font-medium">{children}</th>,
          td: ({ children }) => <td className="border-b px-3 py-2 align-top">{children}</td>,
          h1: H1,
          h2: H2,
          h3: H3,
          ul: ({ children }) => <ul className="my-4 ml-6 list-disc text-muted-foreground">{children}</ul>,
          ol: ({ children }) => <ol className="my-4 ml-6 list-decimal">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="relative w-fit my-4 border-l-4 border-muted px-8 py-6 bg-secondary/20 rounded-r-lg text-muted-foreground">
              <Quote className="absolute top-2 left-2 rotate-180" />
              {children}
              <Quote className="absolute bottom-2 right-2" />
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
