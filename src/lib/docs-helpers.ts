export function normalizeSlug(slug: string) {
  return slug.replace(/^\//, "").replace(/\.mdx?$/i, "")
}
