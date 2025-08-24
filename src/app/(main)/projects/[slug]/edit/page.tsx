import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import ProjectEditor from "@/components/editor/project-editor"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    redirect("/login")
  }

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
