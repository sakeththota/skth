import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { notionLoader } from "notion-astro-loader"
import {
  notionPageSchema,
  transformedPropertySchema,
} from "notion-astro-loader/schemas";

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: "./src/content/blog" }),
  schema: z.object({
    idx: z.number(),
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    tags: z.array(z.string()),
    hidden: z.boolean().optional().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: "./src/content/projects" }),
  schema: z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    source: z.string(),
    live: z.string(),
    src: z.string(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()),
    hidden: z.boolean().optional().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: "./src/content/testimonials" }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    url: z.string(),
    quote: z.string()
  }),
});

const notionServices = notionLoader({
  auth: import.meta.env.NOTION_INTEGRATION_SECRET,
  database_id: import.meta.env.NOTION_DATABASE_ID,
  filter: {
    property: "active",
    checkbox: { equals: true },
  },
});

const services = defineCollection({
  // Degrade gracefully when Notion isn't configured (e.g. local dev without
  // NOTION_INTEGRATION_SECRET) so the dev server / build doesn't crash.
  loader: {
    ...notionServices,
    load: async (context) => {
      if (!import.meta.env.NOTION_INTEGRATION_SECRET) {
        console.warn("[services] NOTION_INTEGRATION_SECRET not set — skipping Notion services collection");
        return;
      }
      try {
        return await notionServices.load(context);
      } catch (error) {
        console.warn(`[services] Notion load failed — skipping: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  },
  schema: notionPageSchema({
    properties: z.object({
      Name: transformedPropertySchema.title,
      Price: transformedPropertySchema.select,
      Duration: transformedPropertySchema.select,
      Description: transformedPropertySchema.rich_text,
      Details: transformedPropertySchema.rich_text
    })
  }).extend({
    // Notion added icon types (e.g. "custom_emoji") the loader's schema doesn't
    // know about; accept any icon/cover so a page's icon can't break the build.
    icon: z.any().nullable(),
    cover: z.any().nullable(),
  })
})

export const collections = { blog, projects, services, testimonials };
