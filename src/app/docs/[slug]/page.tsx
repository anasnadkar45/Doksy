import { notFound } from "next/navigation"
import DocumentationViewer from "@/components/docs/documentation-viewer"
import { prisma } from "@/app/lib/db"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: { page?: string }
}

export default async function DocumentationPage({ params, searchParams }: PageProps) {
  // Fetch published project
  const project = await prisma.project.findFirst({
    where: {
      slug: (await params).slug,
      isPublished: true,
    },
    include: {
      pages: {
        orderBy: { order: "asc" },
      },
      user: {
        select: {
          name: true,
          githubUsername: true,
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  // Get current page
  const currentPageSlug = searchParams.page || project.pages[0]?.slug
  const currentPage = project.pages.find((page) => page.slug === currentPageSlug) || project.pages[0]

  if (!currentPage) {
    notFound()
  }

  return <DocumentationViewer project={project} currentPage={currentPage} />
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findFirst({
    where: {
      slug: params.slug,
      isPublished: true,
    },
  })

  if (!project) {
    return {
      title: "Documentation Not Found",
    }
  }

  return {
    title: `${project.name} - Documentation`,
    description: project.description || `Documentation for ${project.name}`,
  }
}
