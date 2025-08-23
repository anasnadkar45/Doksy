// GitHub API integration utilities
export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  private: boolean
  owner: {
    login: string
    avatar_url: string
  }
  updated_at: string
  language: string | null
  stargazers_count: number
  has_readme: boolean
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  name: string | null
  email: string | null
}

export class GitHubAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Doksy-App",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getUser(): Promise<GitHubUser> {
    return this.fetch("/user")
  }

  async getUserRepos(page = 1, perPage = 30): Promise<GitHubRepo[]> {
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store", // important so GitHub data isn't cached
    })

    const repos = await response.json()

    return repos
  }

  async getRepoReadme(owner: string, repo: string): Promise<string> {
    const response = await this.fetch(`/repos/${owner}/${repo}/readme`)

    // GitHub returns base64 encoded content
    const content = response.content
    return Buffer.from(content, "base64").toString("utf-8")
  }

  async getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    return this.fetch(`/repos/${owner}/${repo}`)
  }
}
