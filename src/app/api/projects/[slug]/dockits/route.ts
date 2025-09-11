import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user.id) {
            NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { canComment } = body

        const project = await prisma.project.findFirst({
            where: {
                slug: (await params).slug,
                userId: session?.user.id,
            },
        })

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        const updatedDockits = await prisma.project.update({
            where: {
                slug: (await params).slug,
                userId: session?.user.id
            },
            data: {
                canComment: canComment
            }
        })

        revalidatePath(`dashboard/projects/${(await params).slug}/dockits`)

        return NextResponse.json({ canComment: updatedDockits.canComment })
    } catch (error) {
        console.error("Error updating project:", error)
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }
}