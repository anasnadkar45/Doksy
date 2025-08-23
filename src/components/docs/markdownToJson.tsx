export interface MarkdownNode {
  type: string
  depth?: number
  value?: string
  url?: string
  alt?: string
  lang?: string
  children?: MarkdownNode[]
}

export async function markdownToJson(markdown: string): Promise<MarkdownNode[]> {
  // Simple markdown parser that converts markdown to a JSON structure
  // This is a basic implementation - in production you'd use a proper parser like remark
  const lines = markdown.split("\n")
  const nodes: MarkdownNode[] = []

  let currentParagraph: string[] = []

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      nodes.push({
        type: "paragraph",
        children: [
          {
            type: "text",
            value: currentParagraph.join(" "),
          },
        ],
      })
      currentParagraph = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith("#")) {
      flushParagraph()
      const depth = trimmed.match(/^#+/)?.[0].length || 1
      const text = trimmed.replace(/^#+\s*/, "")
      nodes.push({
        type: "heading",
        depth,
        children: [
          {
            type: "text",
            value: text,
          },
        ],
      })
    } else if (trimmed.startsWith("```")) {
      flushParagraph()
      const lang = trimmed.replace("```", "")
      // For simplicity, we'll just treat code blocks as text
      nodes.push({
        type: "code",
        lang: lang || "text",
        value: "Code block content",
      })
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph()
      nodes.push({
        type: "list",
        children: [
          {
            type: "listItem",
            children: [
              {
                type: "text",
                value: trimmed.replace(/^[-*]\s*/, ""),
              },
            ],
          },
        ],
      })
    } else if (trimmed.startsWith("> ")) {
      flushParagraph()
      nodes.push({
        type: "blockquote",
        children: [
          {
            type: "text",
            value: trimmed.replace(/^>\s*/, ""),
          },
        ],
      })
    } else if (trimmed === "") {
      flushParagraph()
    } else {
      currentParagraph.push(trimmed)
    }
  }

  flushParagraph()
  return nodes
}
