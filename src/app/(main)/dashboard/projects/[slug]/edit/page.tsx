import { requireUser } from "@/app/data/user/requireUser"
import { Suspense } from "react"
import ProjectLoader from "./_components/ProjectLoader"
import { Skeleton } from "@/components/ui/skeleton"

const EditorSuspense = () => {
  return <Skeleton className="w-full h-full rounded-l-none" />
}
export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireUser()

  return (
    <Suspense fallback={<EditorSuspense />}>
      <ProjectLoader slug={(await params).slug} />
    </Suspense>
  )
}
