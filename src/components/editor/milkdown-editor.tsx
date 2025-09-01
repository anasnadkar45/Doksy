"use client"
import { useEffect, useRef } from "react"
import { Crepe } from "@milkdown/crepe"

import "@milkdown/crepe/theme/common/style.css"
import "@milkdown/crepe/theme/frame.css"
import "./editor-theme.css"

interface MilkdownEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  /**
   * Stable id of the current document (e.g., page.id). When this changes,
   * we switch content by recreating the editor instance.
   */
  docKey: string
}

export default function MilkdownEditor({ content, onChange, placeholder, className, docKey }: MilkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Crepe | null>(null)

  // Create/destroy the editor ONLY when the document identity changes.
  // This prevents the "type one letter then blur" issue (we don't touch the editor on every keystroke),
  // and avoids calling non-existent APIs like setMarkdown.
  useEffect(() => {
    if (!containerRef.current) return

    // Clean up any previous instance (e.g., switching pages)
    if (editorRef.current) {
      editorRef.current.destroy()
      editorRef.current = null
    }

    const editor = new Crepe({
      root: containerRef.current,
      defaultValue: content || placeholder || "",
    })

    // Wire change events once per instance
    editor.on((listener) => {
      listener.markdownUpdated((_, markdown) => {
        onChange(markdown)
      })
    })

    editor.create()
    editorRef.current = editor

    // Cleanup when docKey changes or component unmounts
    return () => {
      editor.destroy()
      editorRef.current = null
    }
  }, [docKey]) // important: NOT dependent on `content`

  return <div ref={containerRef} aria-label="Rich text editor" className={`shadow-sm h-full ${className}`} />
}
