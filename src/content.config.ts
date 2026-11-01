import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    series: z.string().optional(),
    series_part: z.number().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    author: z.string().default('Jason Rinehart'),
    draft: z.boolean().default(false),
  }),
});

const backlogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/backlog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    series: z.string().optional(),
    series_part: z.number().optional(), // Same as posts: publishing only moves the file
    // series_order was never renamed on publish, leaving published parts unnumbered
    series_order: z.never({ error: 'Use series_part instead of series_order' }).optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    author: z.string().default('Jason Rinehart'),
    draft: z.boolean().default(false),
  }),
});

const seriesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    order: z.number().optional(), // Display order on series index
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  posts: postsCollection,
  backlog: backlogCollection,
  series: seriesCollection,
};
