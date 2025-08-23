import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/db"
import { GitHubAPI } from "@/app/lib/github"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const owner = searchParams.get("owner")
    const repo = searchParams.get("repo")

    if (!owner || !repo) {
      return NextResponse.json({ error: "Owner and repo parameters are required" }, { status: 400 })
    }

    const account = await prisma.account.findFirst({
      where:{
        userId:session.user.id,
        providerId:"github"
      }
    })

    if (!account?.accessToken) {
      return NextResponse.json({ error: "GitHub access token not found" }, { status: 400 })
    }

    const github = new GitHubAPI(account.accessToken)
    const readme = await github.getRepoReadme(owner, repo)

    return NextResponse.json({ readme })
  } catch (error) {
    console.error("Error fetching README:", error)
    return NextResponse.json({ error: "Failed to fetch README" }, { status: 500 })
  }
}
