"use client"
import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

const MilkdownEditor = dynamic(() => import("./milkdown-editor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="border-b p-2 bg-secondary">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">Loading editor...</div>
      </div>
      <div className="bg-background p-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-muted-foreground">Initializing editor...</div>
      </div>
    </div>
  ),
})

export type DynamicMilkdownProps = ComponentProps<typeof MilkdownEditor>

export default function DynamicMilkdownEditor(props: DynamicMilkdownProps) {
  return <MilkdownEditor {...props} />
}
