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

/**
 * Get series information with latest posts
 * Returns array of complete series with their metadata
 */
export async function getSeriesCollection() {
  const publishedPosts = await getPublishedPosts();
  
  // Get all posts from both collections to check completeness
  const allPublishedPosts = await getCollection('posts');
  const allBacklogPosts = await getCollection('backlog');
  const allPosts = [...allPublishedPosts, ...allBacklogPosts].filter(post => !post.data.draft);
  
  // Group all posts by series to check completeness
  const allSeriesMap = new Map();
  const publishedSeriesMap = new Map();
  
  // First, group all posts (including future-dated) by series
  allPosts.forEach(post => {
    if (post.data.series) {
      const seriesName = post.data.series;
      
      if (!allSeriesMap.has(seriesName)) {
        allSeriesMap.set(seriesName, []);
      }
      allSeriesMap.get(seriesName).push(post);
    }
  });
  
  // Then, group only published posts by series
  publishedPosts.forEach(post => {
    if (post.data.series) {
      const seriesName = post.data.series;
      
      if (!publishedSeriesMap.has(seriesName)) {
        publishedSeriesMap.set(seriesName, {
          name: seriesName,
          posts: [],
          latestDate: post.data.date,
          latestPost: post,
          firstPost: post
        });
      }
      
      const series = publishedSeriesMap.get(seriesName);
      series.posts.push(post);
      
      // Update latest post if this one is newer
      if (post.data.date > series.latestDate) {
        series.latestDate = post.data.date;
        series.latestPost = post;
      }
      
      // Update first post if this one has a lower series_part number
      const currentFirstPart = series.firstPost.data.series_part || 1;
      const thisPart = post.data.series_part || 1;
      if (thisPart < currentFirstPart) {
        series.firstPost = post;
      }
    }
  });
  
  // Filter to only include complete series (no future-dated posts)
  const completeSeries = Array.from(publishedSeriesMap.values()).filter(series => {
    const allSeriesPosts = allSeriesMap.get(series.name) || [];
    const publishedSeriesPosts = series.posts;
    
    // Series is complete if all posts in the series are published
    return allSeriesPosts.length === publishedSeriesPosts.length;
  });
  
  // Sort by latest post date
  return completeSeries.sort((a, b) => b.latestDate.valueOf() - a.latestDate.valueOf());
}