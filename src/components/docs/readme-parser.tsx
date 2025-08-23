import { type MarkdownNode, markdownToJson } from "./markdownToJson"

export interface DocumentationSection {
  title: string
  slug: string
  content: string
  order: number
  level: number
}

export class ReadmeParser {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  private extractTextContent(nodes: MarkdownNode[]): string {
    return nodes
      .map((node) => {
        if (node.type === "text") {
          return node.value || ""
        }
        if (node.children) {
          return this.extractTextContent(node.children)
        }
        return ""
      })
      .join("")
  }

  private nodeToMarkdown(node: MarkdownNode): string {
    switch (node.type) {
      case "heading":
        const level = node.depth || 1
        const headingText = node.children ? this.extractTextContent(node.children) : ""
        return `${"#".repeat(level)} ${headingText}\n\n`

      case "paragraph":
        const paragraphText = node.children ? this.nodesToMarkdown(node.children) : ""
        return `${paragraphText}\n\n`

      case "text":
        return node.value || ""

      case "emphasis":
        const emphasisText = node.children ? this.nodesToMarkdown(node.children) : ""
        return `*${emphasisText}*`

      case "strong":
        const strongText = node.children ? this.nodesToMarkdown(node.children) : ""
        return `**${strongText}**`

      case "code":
        return `\`${node.value || ""}\``

      case "inlineCode":
        return `\`${node.value || ""}\``

      case "link":
        const linkText = node.children ? this.nodesToMarkdown(node.children) : ""
        return `[${linkText}](${node.url || ""})`

      case "image":
        return `![${node.alt || ""}](${node.url || ""})`

      case "list":
        const listItems = node.children ? this.nodesToMarkdown(node.children) : ""
        return `${listItems}\n`

      case "listItem":
        const itemText = node.children ? this.nodesToMarkdown(node.children) : ""
        return `- ${itemText}\n`

      case "blockquote":
        const quoteText = node.children ? this.nodesToMarkdown(node.children) : ""
        return `> ${quoteText}\n\n`

      case "code":
        return `\`\`\`${node.lang || ""}\n${node.value || ""}\n\`\`\`\n\n`

      case "thematicBreak":
        return "---\n\n"

      default:
        if (node.children) {
          return this.nodesToMarkdown(node.children)
        }
        return node.value || ""
    }
  }

  private nodesToMarkdown(nodes: MarkdownNode[]): string {
    return nodes.map((node) => this.nodeToMarkdown(node)).join("")
  }

  async parseReadme(markdown: string): Promise<DocumentationSection[]> {
    const nodes = await markdownToJson(markdown)
    const sections: DocumentationSection[] = []
    let currentSection: DocumentationSection | null = null
    let sectionContent: MarkdownNode[] = []
    let order = 0

    // Add introduction section for content before first heading
    const introContent: MarkdownNode[] = []
    let foundFirstHeading = false

    for (const node of nodes) {
      if (node.type === "heading" && (node.depth === 1 || node.depth === 2)) {
        // Save previous section if exists
        if (currentSection && sectionContent.length > 0) {
          currentSection.content = this.nodesToMarkdown(sectionContent).trim()
          sections.push(currentSection)
          sectionContent = []
        }

        // Create introduction section from content before first heading
        if (!foundFirstHeading && introContent.length > 0) {
          const introSection: DocumentationSection = {
            title: "Introduction",
            slug: "introduction",
            content: this.nodesToMarkdown(introContent).trim(),
            order: order++,
            level: 1,
          }
          sections.push(introSection)
          foundFirstHeading = true
        }

        // Create new section
        const title = node.children ? this.extractTextContent(node.children) : `Section ${order + 1}`
        currentSection = {
          title,
          slug: this.generateSlug(title),
          content: "",
          order: order++,
          level: node.depth || 1,
        }
        foundFirstHeading = true
      } else {
        // Add content to current section or intro
        if (foundFirstHeading) {
          sectionContent.push(node)
        } else {
          introContent.push(node)
        }
      }
    }

    // Handle remaining content
    if (!foundFirstHeading && introContent.length > 0) {
      const introSection: DocumentationSection = {
        title: "Introduction",
        slug: "introduction",
        content: this.nodesToMarkdown(introContent).trim(),
        order: 0,
        level: 1,
      }
      sections.push(introSection)
    }

    if (currentSection && sectionContent.length > 0) {
      currentSection.content = this.nodesToMarkdown(sectionContent).trim()
      sections.push(currentSection)
    }

    // Ensure we have at least one section
    if (sections.length === 0) {
      sections.push({
        title: "Introduction",
        slug: "introduction",
        content: markdown,
        order: 0,
        level: 1,
      })
    }

    return sections
  }

  // Generate common documentation sections from README content
  generateCommonSections(sections: DocumentationSection[]): DocumentationSection[] {
    const commonSections = new Map<string, DocumentationSection>()

    // Map common section titles to standardized names
    const sectionMappings = {
      installation: ["install", "installation", "setup", "getting started", "quick start"],
      usage: ["usage", "how to use", "examples", "basic usage"],
      api: ["api", "api reference", "methods", "functions"],
      configuration: ["configuration", "config", "options", "settings"],
      contributing: ["contributing", "contribution", "development", "developers"],
      license: ["license", "licensing"],
      changelog: ["changelog", "changes", "history", "releases"],
      faq: ["faq", "frequently asked questions", "questions"],
      troubleshooting: ["troubleshooting", "issues", "problems", "debugging"],
    }

    // Process each section and try to categorize it
    sections.forEach((section) => {
      const lowerTitle = section.title.toLowerCase()
      let mapped = false

      for (const [standardName, variations] of Object.entries(sectionMappings)) {
        if (variations.some((variation) => lowerTitle.includes(variation))) {
          if (!commonSections.has(standardName)) {
            commonSections.set(standardName, {
              ...section,
              title: this.capitalizeTitle(standardName),
              slug: standardName,
            })
            mapped = true
            break
          }
        }
      }

      // If not mapped to a common section, keep original
      if (!mapped) {
        commonSections.set(section.slug, section)
      }
    })

    return Array.from(commonSections.values()).sort((a, b) => a.order - b.order)
  }

  private capitalizeTitle(title: string): string {
    return title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Extract metadata from README (title, description, etc.)
  extractMetadata(markdown: string): { title?: string; description?: string } {
    const lines = markdown.split("\n")
    let title: string | undefined
    let description: string | undefined

    // Look for first heading as title
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith("# ")) {
        title = trimmed.substring(2).trim()
        break
      }
    }

    // Look for first paragraph as description
    let foundTitle = false
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith("# ")) {
        foundTitle = true
        continue
      }
      if (foundTitle && trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("!")) {
        description = trimmed
        break
      }
    }

    return { title, description }
  }
}
