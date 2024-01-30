import { defineCollection } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    tags: z.array(z.string()),
  }),
})

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    source: z.string(),
    live: z.string(),
    src: z.string(),
    tags: z.array(z.string()),
  }),
})

export const collections = { blog, projects }


