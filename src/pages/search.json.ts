import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../utils/posts';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  
  // Create search index with post data
  const searchIndex = posts
    .filter(post => !post.data.draft)
    .map(post => ({
      id: post.slug,
      title: post.data.title,
      description: post.data.description || '',
      content: post.body,
      tags: post.data.tags || [],
      date: post.data.date.toISOString(),
      url: `/${post.slug}/`,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};