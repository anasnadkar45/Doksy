import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's project statistics
    const [totalProjects, publishedProjects, totalPages] = await Promise.all([
      prisma.project.count({
        where: { userId: session.user.id },
      }),
      prisma.project.count({
        where: { userId: session.user.id, isPublished: true },
      }),
      prisma.page.count({
        where: {
          project: { userId: session.user.id },
        },
      }),
    ])

    // Get recent activity
    const recentProjects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      stats: {
        totalProjects,
        publishedProjects,
        totalPages,
        draftProjects: totalProjects - publishedProjects,
      },
      recentActivity: recentProjects,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
