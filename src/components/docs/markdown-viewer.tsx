"use client"

import React, { useCallback, useMemo, useState } from "react"
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

export type MarkdownViewerProps = {
  content: string
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

export default function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  const remarkList = useMemo(() => remarkPlugins, [])
  const rehypeList = useMemo(() => rehypePlugins, [])

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

  return (
    <div className={className}>
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
