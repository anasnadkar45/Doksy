import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        slug: (await params).slug,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const pages = await prisma.page.findMany({
      where: { projectId: project.id },
      orderBy: { order: "asc" },
    })

    return NextResponse.json({ pages })
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug: pageSlug, content } = body

    const project = await prisma.project.findFirst({
      where: {
        slug: (await params).slug,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Get the highest order number
    const lastPage = await prisma.page.findFirst({
      where: { projectId: project.id },
      orderBy: { order: "desc" },
    })

    const page = await prisma.page.create({
      data: {
        title,
        slug: pageSlug,
        content: content || "",
        order: (lastPage?.order || 0) + 1,
        projectId: project.id,
      },
    })

    return NextResponse.json({ page })
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}
