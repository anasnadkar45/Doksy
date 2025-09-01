import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { name, description, liveUrl, slug, creator, isPublished } = body

        const project = await prisma.project.findFirst({
            where: {
                slug: (await params).slug,
                userId: session.user.id,
            },
        })

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        const exsistingSlug = await prisma.project.findFirst({
            where: {
                slug: slug,
                NOT: {
                    id: project.id
                }
            }
        })

        if (exsistingSlug) {
            return NextResponse.json({ error: "Domain name already exists" }, { status: 404 })
        }

        const updatedProject = await prisma.project.update({
            where: { id: project.id },
            data: {
                name: name || project.name,
                description: description || project.description,
                liveUrl: liveUrl || project.liveUrl,
                slug: slug || project.slug,
                creator: creator || project.creator,
                isPublished: isPublished || project.isPublished,
            },
        })

        revalidatePath(`dashboard/projects/${updatedProject.slug}/settings`)

        return NextResponse.json({ project: updatedProject })
    } catch (error) {
        console.error("Error updating project:", error)
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }
}
