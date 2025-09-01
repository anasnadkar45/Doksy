export type ImportedPage = {
  title: string
  slug: string
  content: string
  isMdx?: boolean
}

const GITHUB_API = "https://api.github.com"

function parseRepoUrl(githubUrl: string): { owner: string; repo: string } {
  try {
    const url = new URL(githubUrl)
    const parts = url.pathname.replace(/^\/+/, "").split("/")
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") }
  } catch {
    throw new Error("Invalid GitHub URL")
  }
}

async function ghFetch(path: string, token?: string, init?: RequestInit) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "doksy-importer",
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${GITHUB_API}${path}`, { headers, ...init })
  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    throw new Error(`GitHub API error ${res.status}: ${errText || res.statusText}`)
  }
  return res
}

function slugify(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

function decodeBase64(content: string) {
  if (typeof atob === "function") {
    return decodeURIComponent(escape(atob(content)))
  }
  return Buffer.from(content, "base64").toString("utf-8")
}

export async function importFromGitHubRepo(githubUrl: string, token?: string) {
  const { owner, repo } = parseRepoUrl(githubUrl)

  // Get default branch
  const repoMeta = await (await ghFetch(`/repos/${owner}/${repo}`, token)).json()
  const defaultBranch = repoMeta.default_branch || "main"

  // Get README (contents API auto-resolves readme file)
  let readmeMarkdown = ""
  try {
    const readmeRes = await (await ghFetch(`/repos/${owner}/${repo}/readme`, token)).json()
    readmeMarkdown = decodeBase64(readmeRes.content || "")
  } catch {
    // no README
  }

  // Get file tree
  const treeRes = await (await ghFetch(`/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, token)).json()
  const mdxFiles: { path: string }[] = (treeRes.tree || []).filter(
    (n: any) => typeof n.path === "string" && n.type === "blob" && n.path.toLowerCase().endsWith(".mdx"),
  )

  // Fetch MDX file contents
  const mdxPages: ImportedPage[] = []
  for (const node of mdxFiles) {
    const fileRes = await (
      await ghFetch(`/repos/${owner}/${repo}/contents/${encodeURIComponent(node.path)}`, token)
    ).json()
    const content = decodeBase64(fileRes.content || "")
    const baseName = node.path.split("/").pop() || "page"
    const title = baseName.replace(/\.mdx$/i, "").replace(/[-_]/g, " ")
    const slug = node.path // keep path to preserve potential nesting
    mdxPages.push({ title, slug, content, isMdx: true })
  }

  // Split README into sections by H2/H3; H1 treated as project name/intro
  const readmePages: ImportedPage[] = []
  if (readmeMarkdown) {
    const lines = readmeMarkdown.split("\n")
    let currentTitle = "Overview"
    let currentSlug = "overview"
    let currentContent: string[] = []
    const pushCurrent = () => {
      readmePages.push({ title: currentTitle, slug: currentSlug + ".md", content: currentContent.join("\n") })
    }

    for (const line of lines) {
      const h2 = /^##\s+(.+)$/.exec(line)
      if (h2) {
        if (currentContent.length) pushCurrent()
        currentTitle = h2[1].trim()
        currentSlug = slugify(currentTitle) + ".md"
        currentContent = []
        continue
      }
      // accumulate
      currentContent.push(line)
    }
    if (currentContent.length) pushCurrent()
    // If only one page produced and it's empty, skip
  }

  return { readmePages, mdxPages, owner, repo, defaultBranch }
}
