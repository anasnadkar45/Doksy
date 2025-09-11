import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1");
    const perPage = Number.parseInt(searchParams.get("per_page") || "10")

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's GitHub access token from database
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "github",
      },
      select: { accessToken: true },
    })

    const response = await fetch(`https://api.github.com/user/repos?sort=updated&per_page=${perPage}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${account?.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store", // important so GitHub data isn't cached
    })

    if (!response.ok) {
      console.error("GitHub API error:", response.status, response.statusText)
      return NextResponse.json({ error: "Failed to fetch from GitHub API" }, { status: 500 })
    }

    const repos = await response.json()
    return NextResponse.json({ repos,page,perPage,hasMore: repos.length === perPage })
  } catch (error) {
    console.error("Error fetching GitHub repos:", error)
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 })
  }
}
