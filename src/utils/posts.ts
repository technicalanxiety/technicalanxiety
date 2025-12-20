import { getCollection } from 'astro:content';

/**
 * Get published posts (excludes drafts and future-dated posts)
 */
export async function getPublishedPosts() {
  const posts = await getCollection('posts');
  const now = new Date();
  
  return posts.filter(post => {
    // Exclude drafts
    if (post.data.draft) return false;
    
    // Exclude future-dated posts
    if (post.data.date > now) return false;
    
    return true;
  });
}

/**
 * Get all posts (including future-dated, but excluding drafts)
 * Use this for admin/preview purposes only
 */
export async function getAllPosts() {
  const posts = await getCollection('posts');
  return posts.filter(post => !post.data.draft);
}