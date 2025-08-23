"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { useEffect } from "react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  ChevronDown,
  LinkIcon,
  ImageIcon,
  Type,
  Quote,
  Code,
} from "lucide-react"

interface EnhancedRichEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function TiptapEditor({ content, onChange, placeholder, className }: EnhancedRichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "tiptap-bullet-list",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "tiptap-ordered-list",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "tiptap-list-item",
          },
        },
        heading: {
          HTMLAttributes: {
            class: "tiptap-heading",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "tiptap-paragraph",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "tiptap-blockquote",
          },
        },
        code: {
          HTMLAttributes: {
            class: "tiptap-code",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "tiptap-code-block",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "tiptap-link",
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "tiptap-task-list",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "tiptap-task-item",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor focus:outline-none",
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false)
    }
  }, [editor, content])

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter URL:", previousUrl)

    if (url === null) {
      return
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const getHeadingText = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1"
    if (editor.isActive("heading", { level: 2 })) return "H2"
    if (editor.isActive("heading", { level: 3 })) return "H3"
    if (editor.isActive("heading", { level: 4 })) return "H4"
    return "Text"
  }

  return (
    <div className={`border rounded-xl overflow-hidden shadow-sm ${className}`}>
      {/* Enhanced Toolbar */}
      <div className="border-b bg-muted p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Text Style Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 min-w-[80px] justify-between bg-transparent">
                <Type className="h-4 w-4" />
                {getHeadingText()}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`flex items-center gap-2 ${editor.isActive("paragraph") ? "bg-accent" : ""}`}
              >
                <Type className="h-4 w-4" />
                Normal Text
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`flex items-center gap-2 ${editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}`}
              >
                <span className="font-bold text-2xl">H1</span>
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`flex items-center gap-2 ${editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}`}
              >
                <span className="font-bold text-xl">H2</span>
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`flex items-center gap-2 ${editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}`}
              >
                <span className="font-bold text-lg">H3</span>
                Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={`flex items-center gap-2 ${editor.isActive("heading", { level: 4 }) ? "bg-accent" : ""}`}
              >
                <span className="font-bold">H4</span>
                Heading 4
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-8" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              aria-label="Bold"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              aria-label="Italic"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("underline")}
              onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
              aria-label="Underline"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("code")}
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
              aria-label="Code"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Code className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Lists */}
          <div className="flex items-center gap-1">
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              aria-label="Bullet List"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              aria-label="Numbered List"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("taskList")}
              onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
              aria-label="Task List"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <CheckSquare className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "left" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
              aria-label="Align Left"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "center" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
              aria-label="Align Center"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "right" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
              aria-label="Align Right"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "justify" })}
              onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
              aria-label="Justify"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <AlignJustify className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Media & Links */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={setLink}
              className={`${editor.isActive("link") ? "bg-primary text-primary-foreground" : ""}`}
              aria-label="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={addImage} aria-label="Add Image">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Toggle
              size="sm"
              pressed={editor.isActive("blockquote")}
              onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
              aria-label="Quote"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Quote className="h-4 w-4" />
            </Toggle>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              aria-label="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              aria-label="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content with Beautiful Styling */}
      <div className="bg-white min-h-[400px]">
        <EditorContent editor={editor} className="tiptap-content" />
        {!content && <div className="absolute top-20 left-6 text-gray-400 pointer-events-none">{placeholder}</div>}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .tiptap-content {
          padding: 1.5rem;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          line-height: 1.7;
        }

        .tiptap-editor {
          min-height: 400px;
          outline: none;
        }

        .tiptap-editor .tiptap-heading {
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .tiptap-editor h1.tiptap-heading {
          font-size: 2rem;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }

        .tiptap-editor h2.tiptap-heading {
          font-size: 1.5rem;
          color: #374151;
        }

        .tiptap-editor h3.tiptap-heading {
          font-size: 1.25rem;
          color: #4b5563;
        }

        .tiptap-editor h4.tiptap-heading {
          font-size: 1.125rem;
          color: #6b7280;
        }

        .tiptap-editor .tiptap-paragraph {
          margin-bottom: 1rem;
          color: #374151;
        }

        .tiptap-editor .tiptap-bullet-list,
        .tiptap-editor .tiptap-ordered-list {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .tiptap-editor .tiptap-bullet-list {
          list-style-type: disc;
        }

        .tiptap-editor .tiptap-ordered-list {
          list-style-type: decimal;
        }

        .tiptap-editor .tiptap-list-item {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .tiptap-editor .tiptap-task-list {
          list-style: none;
          padding-left: 0;
          margin: 1rem 0;
        }

        .tiptap-editor .tiptap-task-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .tiptap-editor .tiptap-task-item input[type="checkbox"] {
          margin-right: 0.5rem;
          margin-top: 0.25rem;
        }

        .tiptap-editor .tiptap-blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f9fafb;
          padding: 1rem;
          border-radius: 0.375rem;
        }

        .tiptap-editor .tiptap-code {
          background-color: #f3f4f6;
          color: #dc2626;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 0.875em;
        }

        .tiptap-editor .tiptap-code-block {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          overflow-x: auto;
        }

        .tiptap-editor .tiptap-link {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }

        .tiptap-editor .tiptap-link:hover {
          color: #1d4ed8;
        }

        .tiptap-editor .tiptap-image {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .tiptap-editor strong {
          font-weight: 600;
          color: #1f2937;
        }

        .tiptap-editor em {
          font-style: italic;
        }

        .tiptap-editor u {
          text-decoration: underline;
        }

        .tiptap-editor [data-text-align="left"] {
          text-align: left;
        }

        .tiptap-editor [data-text-align="center"] {
          text-align: center;
        }

        .tiptap-editor [data-text-align="right"] {
          text-align: right;
        }

        .tiptap-editor [data-text-align="justify"] {
          text-align: justify;
        }
      `}</style>
    </div>
  )
}
