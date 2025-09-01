import ProjectEditor from "@/components/editor/project-editor-milkdow"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

export default async function ProjectLoader({ slug }: { slug: string }) {
  const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/projects/${slug}`, {
    headers: { Cookie: (await headers()).get("cookie") || "" },
    cache: "no-store", // ensures fresh fetch
  })

  if (!response.ok) {
    if (response.status === 404) notFound()
    throw new Error("Failed to fetch project")
  }

  const { project } = await response.json()
  return <ProjectEditor project={project} />
}
