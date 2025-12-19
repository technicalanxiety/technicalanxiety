import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config.ts';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  // Sort posts by date (newest first) and take the most recent ones
  const sortedPosts = posts
    .filter(post => !post.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .slice(0, 20); // Include last 20 posts in RSS feed

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || `Read "${post.data.title}" on Technical Anxiety`,
      author: `${siteConfig.author.name}@technicalanxiety.com (${siteConfig.author.name})`,
      link: `/${post.slug}/`,
      content: post.body, // Include full content in RSS feed
      categories: post.data.tags || [],
    })),
    customData: `<language>en-us</language>`,
  });
}