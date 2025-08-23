"use client"
import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

const TiptapEditor = dynamic(() => import("./tiptap-editor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-500">Loading editor...</div>
      </div>
      <div className="bg-white dark:bg-gray-900 p-4 min-h-[300px] flex items-center justify-center">
        <div className="text-gray-500">Initializing editor...</div>
      </div>
    </div>
  ),
})

export default function DynamicTiptapEditor(props: ComponentProps<typeof TiptapEditor>) {
  return <TiptapEditor {...props} />
}
