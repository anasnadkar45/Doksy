// lib/markdownToJson.ts
import { unified } from "unified"
import remarkParse from "remark-parse"

export type MarkdownNode = {
  type: string
  depth?: number
  value?: string
  children?: MarkdownNode[]
}

export async function markdownToJson(markdown: string): Promise<MarkdownNode[]> {
  const tree: any = unified().use(remarkParse).parse(markdown)

  function transform(node: any): MarkdownNode {
    return {
      type: node.type,
      depth: node.depth,
      value: node.value,
      children: node.children ? node.children.map(transform) : undefined,
    }
  }

  return tree.children.map(transform)
}
