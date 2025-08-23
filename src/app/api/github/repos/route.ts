import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { GitHubAPI } from "@/app/lib/github"
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

    // Get user's GitHub access token from database
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "github",
      },
      select: { accessToken: true },
    })

    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${account?.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store", // important so GitHub data isn't cached
    })

    const repos = await response.json()

    console.log(repos)

    return NextResponse.json({ repos: repos })
  } catch (error) {
    console.error("Error fetching GitHub repos:", error)
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 })
  }
}
