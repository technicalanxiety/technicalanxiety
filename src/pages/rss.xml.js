import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { getPublishedPosts } from '../utils/posts.ts';
import { siteConfig } from '../config.ts';

/**
 * Feed readers have no base URL for our pages, so root-relative URLs
 * (/_astro/img.webp, /other-post/) must become absolute. Protocol-relative
 * (//cdn...) and already-absolute URLs are left alone.
 */
function absolutizeUrls(html, site) {
  const origin = site.origin;
  return html
    .replace(/(\s(?:src|href|poster)=")\/(?!\/)/g, `$1${origin}/`)
    .replace(/(\ssrcset=")([^"]*)"/g, (_, attr, value) => {
      const fixed = value
        .split(',')
        .map((candidate) => candidate.trim().replace(/^\/(?!\/)/, `${origin}/`))
        .join(', ');
      return `${attr}${fixed}"`;
    });
}

export async function GET(context) {
  const posts = await getPublishedPosts();

  // Sort posts by date (newest first) and take the most recent ones
  const sortedPosts = posts
    .filter(post => !post.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .slice(0, 20); // Include last 20 posts in RSS feed

  // Render each post through Astro (same pipeline as the post pages), so the
  // feed gets real HTML with Shiki highlighting and optimized image URLs
  // instead of raw markdown with ../../assets paths that only resolve in src.
  const container = await AstroContainer.create();

  const items = await Promise.all(sortedPosts.map(async (post) => {
    const { Content } = await render(post);
    const html = await container.renderToString(Content);

    return {
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || `Read "${post.data.title}" on Technical Anxiety`,
      author: `${siteConfig.author.name}@technicalanxiety.com (${siteConfig.author.name})`,
      link: `/${post.id}/`,
      content: absolutizeUrls(html, context.site),
      categories: post.data.tags || [],
    };
  }));

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items,
    customData: `<language>en-us</language>`,
  });
}
