import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        slug: params.slug,
        userId: session.user.id,
      },
      include: {
        pages: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Validate that project has at least one page
    if (project.pages.length === 0) {
      return NextResponse.json({ error: "Cannot publish project without pages" }, { status: 400 })
    }

    // Update project to published status
    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: {
        isPublished: true,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/dashboard')
    return NextResponse.json({
      project: updatedProject,
      publicUrl: `${process.env.BETTER_AUTH_URL}/docs/${project.slug}`,
    })
  } catch (error) {
    console.error("Error publishing project:", error)
    return NextResponse.json({ error: "Failed to publish project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        slug: params.slug,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Update project to unpublished status
    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: {
        isPublished: false,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ project: updatedProject })
  } catch (error) {
    console.error("Error unpublishing project:", error)
    return NextResponse.json({ error: "Failed to unpublish project" }, { status: 500 })
  }
}
