import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // Handle Jekyll date strings
    tags: z.array(z.string()).optional(),
    series: z.string().optional(),
    series_part: z.number().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    author: z.string().default('Jason Rinehart'),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  posts: postsCollection,
};