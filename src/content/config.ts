import { z, defineCollection } from "astro:content";
import { notionLoader } from "notion-astro-loader"
import {
  notionPageSchema,
  transformedPropertySchema,
} from "notion-astro-loader/schemas";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    idx: z.number(),
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    tags: z.array(z.string())
  }),
});

const projects = defineCollection({
  type: "data",
  schema: z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    source: z.string(),
    live: z.string(),
    src: z.string(),
    tags: z.array(z.string()),
  }),
});

const testimonials = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    title: z.string(),
    url: z.string(),
    quote: z.string()
  }),
});

const services = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_INTEGRATION_SECRET,
    database_id: import.meta.env.NOTION_DATABASE_ID,
    filter: {
      property: "active",
      checkbox: { equals: true },
    },
  }),
  schema: notionPageSchema({
    properties: z.object({
      Name: transformedPropertySchema.title,
      Price: transformedPropertySchema.select,
      Duration: transformedPropertySchema.select,
      Description: transformedPropertySchema.rich_text,
    })
  })
}) 

export const collections = { blog, projects, services, testimonials };
