import { prisma } from "@/app/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
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
      return NextResponse.json({ error: "Documentation not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error fetching documentation:", error)
    return NextResponse.json({ error: "Failed to fetch documentation" }, { status: 500 })
  }
}
