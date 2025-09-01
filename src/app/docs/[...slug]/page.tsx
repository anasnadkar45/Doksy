import { notFound } from "next/navigation"
import { prisma } from "@/app/lib/db"
import { Suspense } from "react"
import DocumentationSkeleton from "@/components/docs/documentation-skeleton"
import DocumentationViewer from "@/components/docs/documentation-viewer"

interface PageProps {
  params: { slug?: string[] }
}

export const dynamic = "force-dynamic"

export default async function DocumentationPage({ params }: PageProps) {
  const { slug = [] } = params
  if (slug.length === 0) return notFound()

  const projectSlug = slug[0]
  const pagePath = slug.slice(1)

  // Fetch project with a lightweight pages index (no content)
  const project = await prisma.project.findFirst({
    where: { slug: projectSlug, isPublished: true },
    select: {
      id: true,
      name: true,
      description: true,
      liveUrl: true,
      creator: true,
      slug: true,
      githubUrl: true,
      user: { select: { name: true, githubUsername: true } },
      pages: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          parentId: true,
          // no content here
        },
      },
    },
  })

  if (!project) return notFound()

  // Determine active page slug
  const currentSlug = pagePath.length === 0 ? (project.pages[0]?.slug ?? null) : pagePath[pagePath.length - 1] || null
  if (!currentSlug) return notFound()

  // Fetch only the current page's content
  const currentPage = await prisma.page.findFirst({
    where: { projectId: project.id, slug: currentSlug },
    select: {
      id: true,
      title: true,
      slug: true,
      order: true,
      parentId: true,
      content: true,
    },
  })

  if (!currentPage) return notFound()

  return (
    <Suspense fallback={<DocumentationSkeleton />}>
      <DocumentationViewer project={project as any} currentPage={currentPage as any} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const slugArray = params.slug || []
  if (slugArray.length === 0) return { title: "Not Found" }

  const projectSlug = slugArray[0]

  const project = await prisma.project.findFirst({
    where: { slug: projectSlug, isPublished: true },
  })

  if (!project) {
    return { title: "Documentation Not Found" }
  }

  return {
    title: `${project.name} - Documentation`,
    description: project.description || `Documentation for ${project.name}`,
    icons: {
      icon: "/Logo.svg",
      shortcut: "/Logo.svg",
      apple: "/Logo.svg",
    },
    openGraph: {
      title: "Doksy | Turn Your README into Beautiful Documentation",
      description:
        "Convert your GitHub README into a stunning multi-page documentation site. Fast, minimal, and developer-friendly.",
      url: "https://doksy.site",
      siteName: "Doksy",
      images: [
        {
          url: "https://doksy.site/og-image.png",
          width: 1200,
          height: 630,
          alt: "Doksy Documentation Preview",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Doksy | Turn Your README into Beautiful Documentation",
      description:
        "Doksy converts your GitHub README into a clean, professional documentation site in seconds.",
      images: ["https://doksy.site/og-image.png"],
      site: "@NadkarAnas45",
    },
  }
}
