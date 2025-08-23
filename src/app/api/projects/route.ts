import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { GitHubAPI } from "@/app/lib/github"
import { ReadmeParser } from "@/app/lib/readme-parser"
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

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { repoId, repoName, repoOwner, repoUrl, name, description } = body

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
    let slug = baseSlug
    let counter = 1

    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Get user's GitHub access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "github",
      },
      select: { accessToken: true },
    })

    if (!account?.accessToken) {
      return NextResponse.json({ error: "GitHub access token not found" }, { status: 400 })
    }

    // Fetch README content from GitHub
    const github = new GitHubAPI(account.accessToken)
    const readmeContent = await github.getRepoReadme(repoOwner, repoName)

    // Parse README into sections
    const parser = new ReadmeParser()
    const sections = await parser.parseReadme(readmeContent)
    const metadata = parser.extractMetadata(readmeContent)

    // Create project
    const project = await prisma.project.create({
      data: {
        name: metadata.title || name,
        description: metadata.description || description,
        slug,
        githubRepoId: repoId.toString(),
        githubRepoName: repoName,
        githubOwner: repoOwner,
        githubUrl: repoUrl,
        userId: session.user.id,
      },
    })

    // Create pages from parsed sections
    await Promise.all(
      sections.map((section) =>
        prisma.page.create({
          data: {
            title: section.title,
            slug: section.slug,
            content: section.content,
            order: section.order,
            projectId: project.id,
          },
        }),
      ),
    )

    return NextResponse.json({ project, sections })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
