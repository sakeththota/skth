import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    idx: z.number(),
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean(),
  }),
});

const projects = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    source: z.string(),
    live: z.string(),
    src: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog, projects };
