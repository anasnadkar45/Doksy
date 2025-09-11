import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"
import { CommentStatus, CommentType } from "@/generated/prisma"
import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const body = await request.json()
        const { message, page, commentFor, projectId, userId, type, status } = body

        if (!message?.trim()) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        if (!projectId || !userId) {
            return NextResponse.json({ error: "Project ID and User ID are required" }, { status: 400 })
        }

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
            },
        })

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const newComment = await prisma.comment.create({
            data: {
                message: message.trim(),
                page: page || null,
                commentFor: commentFor || null,
                projectId: projectId,
                userId: userId,
                type: type && Object.values(CommentType).includes(type) ? type : CommentType.COMMENT,
                status: status && Object.values(CommentStatus).includes(status) ? status : CommentStatus.OPEN,
            },
            include: {
                User: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        })

        revalidatePath(`/docs/${(await params).slug}/`)
        return NextResponse.json(
            {
                success: true,
                comment: newComment,
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Error creating comment:", error)
        return NextResponse.json(
            {
                error: "Failed to create comment",
                details: process.env.NODE_ENV === "development" ? error : undefined,
            },
            { status: 500 },
        )
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        const userId = session?.user.id
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        const body = await request.json()
        const { commentId } = body
        if (!commentId) {
            return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
        }

        // Find the comment and verify ownership
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId,
                userId: userId
            },
        })

        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 })
        }

        // Check if the user is the owner of the comment
        if (comment.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized: You can only delete your own comments" }, { status: 403 })
        }

        // Delete the comment
        await prisma.comment.delete({
            where: {
                id: commentId,
            },
        })

        revalidatePath(`/docs/${(await params).slug}/`)
        return NextResponse.json(
            {
                success: true,
                message: "Comment deleted successfully",
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Error deleting comment:", error)
        return NextResponse.json(
            {
                error: "Failed to delete comment",
                details: process.env.NODE_ENV === "development" ? error : undefined,
            },
            { status: 500 },
        )
    }
}