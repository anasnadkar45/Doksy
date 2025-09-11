import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/db"
import { CommentStatus } from "@/generated/prisma"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string; commentId: string }> }) {
  try {
    const commentId = (await params).commentId
    const body = await request.json()
    const { status } = body

    // Validate status
    if (!Object.values(CommentStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update comment status
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { status },
      include: {
        User: true,
      },
    })

    return NextResponse.json({ comment: updatedComment })
  } catch (error) {
    console.error("Error updating comment status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
