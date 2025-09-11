import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/db"
import { CommentStatus, CommentType } from "@/generated/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") as CommentStatus | "all"
    const type = searchParams.get("type") as CommentType | "all"
    const sortField = searchParams.get("sortField") || "createdAt"
    const sortDirection = searchParams.get("sortDirection") || "desc"

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Build where clause
    const where: any = {
      projectId: projectId,
    }

    if (search) {
      where.OR = [
        { message: { contains: search, mode: "insensitive" } },
        { page: { contains: search, mode: "insensitive" } },
        { User: { name: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (status !== "all") {
      where.status = status
    }

    if (type !== "all") {
      where.type = type
    }

    // Build orderBy clause
    let orderBy: any = {}
    if (sortField === "user") {
      orderBy = { User: { name: sortDirection } }
    } else {
      orderBy[sortField] = sortDirection
    }

    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          User: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ])

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
