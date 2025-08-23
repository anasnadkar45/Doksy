import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import rehypePrism from "rehype-prism-plus"
import rehypeSlug from "rehype-slug"

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkRehype) // Convert to HTML AST
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypePrism) // Syntax highlighting for code blocks
    .use(rehypeStringify) // Convert to HTML string
    .process(markdown)

  return result.toString()
}
