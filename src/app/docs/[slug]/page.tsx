import { notFound } from "next/navigation"
import DocumentationViewer from "@/components/docs/documentation-viewer"
import { prisma } from "@/app/lib/db"
import { Suspense } from "react"
import DocumentationSkeleton from "@/components/docs/documentation-skeleton"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export const dynamic = "force-dynamic";

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
  const currentPageSlug = (await searchParams).page || project.pages[0]?.slug
  const currentPage = project.pages.find((page) => page.slug === currentPageSlug) || project.pages[0]

  if (!currentPage) {
    notFound()
  }

  return (
    <Suspense fallback={<DocumentationSkeleton />}>
      <DocumentationViewer project={project} currentPage={currentPage} />
    </Suspense>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const project = await prisma.project.findFirst({
    where: {
      slug: (await params).slug,
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
