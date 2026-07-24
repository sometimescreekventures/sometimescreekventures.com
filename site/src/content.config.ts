import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    slug: z.string(),
    role: z.string(),
    summary: z.string(),
    stats: z.array(z.object({ label: z.string(), value: z.string() })),
    stack: z.array(z.string()),
    order: z.number(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    repoUrl: z.string().url(),
    highlights: z.array(z.string()),
    order: z.number(),
  }),
});

export const collections = { work, projects };
