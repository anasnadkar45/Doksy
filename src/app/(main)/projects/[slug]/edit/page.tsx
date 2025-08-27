import { headers } from "next/headers"
import { notFound } from "next/navigation"
import ProjectEditor from "@/components/editor/project-editor"
import { requireUser } from "@/app/data/user/requireUser"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const user = await requireUser();

  // Fetch project data
  const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/projects/${(await params).slug}`, {
    headers: {
      Cookie: (await headers()).get("cookie") || "",
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      notFound()
    }
    throw new Error("Failed to fetch project")
  }

  const { project } = await response.json()

  return <ProjectEditor project={project} />
}
