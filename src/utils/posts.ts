import { getCollection } from 'astro:content';

/**
 * Get published posts (excludes drafts and future-dated posts)
 * Uses Central Time (America/Chicago) for consistent publishing
 */
export async function getPublishedPosts() {
  const posts = await getCollection('posts');
  
  // Get current date in Central Time zone (just the date part)
  const nowUTC = new Date();
  const centralTimeString = nowUTC.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // Parse Central date: MM/DD/YYYY -> YYYY-MM-DD
  const [month, day, year] = centralTimeString.split('/');
  const centralDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  return posts.filter(post => {
    // Exclude drafts
    if (post.data.draft) return false;
    
    // Exclude future-dated posts (using Central Time)
    // Use UTC methods to avoid timezone conversion issues
    const postDate = new Date(post.data.date);
    const postDateString = `${postDate.getUTCFullYear()}-${String(postDate.getUTCMonth() + 1).padStart(2, '0')}-${String(postDate.getUTCDate()).padStart(2, '0')}`;
    
    // Post is future if its date string is greater than Central date string
    if (postDateString > centralDateString) return false;
    
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