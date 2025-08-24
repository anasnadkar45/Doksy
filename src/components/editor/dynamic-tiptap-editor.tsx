"use client"
import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

const TiptapEditor = dynamic(() => import("./tiptap-editor"), {
  ssr: false,
  loading: () => (
    <div className="border  rounded-lg overflow-hidden">
      <div className="border-b  p-2 bg-secondary">
        <div className="flex items-center gap-2 text-sm text-gray-500">Loading editor...</div>
      </div>
      <div className="bg-white p-4 min-h-[300px] flex items-center justify-center">
        <div className="text-muted-foreground">Initializing editor...</div>
      </div>
    </div>
  ),
})

export default function DynamicTiptapEditor(props: ComponentProps<typeof TiptapEditor>) {
  return <TiptapEditor {...props} />
}
