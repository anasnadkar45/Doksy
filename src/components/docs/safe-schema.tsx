import { defaultSchema } from "hast-util-sanitize"

// Allow extra attributes often used by ReactMarkdown + our UI classes
export const safeSchema: any = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a || []), ["target"], ["rel"], ["className"]],
    code: [...(defaultSchema.attributes?.code || []), ["className", "data-language"]],
    pre: [...(defaultSchema.attributes?.pre || []), ["className"]],
    img: [
      ...(defaultSchema.attributes?.img || []),
      ["className"],
      ["alt"],
      ["width"],
      ["height"],
      ["loading"],
      ["decoding"],
    ],
    div: [...(defaultSchema.attributes?.div || []), ["className"]],
    span: [...(defaultSchema.attributes?.span || []), ["className"]],
    table: [...(defaultSchema.attributes?.table || []), ["className"]],
    th: [...(defaultSchema.attributes?.th || []), ["className"]],
    td: [...(defaultSchema.attributes?.td || []), ["className"]],
    h1: [...(defaultSchema.attributes?.h1 || []), ["className", "id"]],
    h2: [...(defaultSchema.attributes?.h2 || []), ["className", "id"]],
    h3: [...(defaultSchema.attributes?.h3 || []), ["className", "id"]],
    p: [...(defaultSchema.attributes?.p || []), ["className"]],
    ul: [...(defaultSchema.attributes?.ul || []), ["className"]],
    ol: [...(defaultSchema.attributes?.ol || []), ["className"]],
    li: [...(defaultSchema.attributes?.li || []), ["className"]],
    blockquote: [...(defaultSchema.attributes?.blockquote || []), ["className"]],
    hr: [...(defaultSchema.attributes?.hr || []), ["className"]],
  },
}
