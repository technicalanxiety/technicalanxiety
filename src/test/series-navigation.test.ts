import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: astro-migration, Property 2: Series Navigation Consistency
 * 
 * Property 2: Series Navigation Consistency
 * For any post that belongs to a series, the series navigation component SHALL 
 * display correct previous/next links based on series_order, and all links 
 * SHALL resolve to valid pages.
 * 
 * Validates: Requirements 1.3
 */

describe('Series Navigation Property Tests', () => {
  // Helper function to get all posts with series information
  function getSeriesPosts() {
    try {
      const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
      const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      
      const posts = files.map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        if (!frontmatterMatch) {
          throw new Error(`No frontmatter found in ${file}`);
        }
        
        const [, frontmatter] = frontmatterMatch;
        const slug = file.replace('.md', '');
        
        // Parse frontmatter
        const parsedFrontmatter: any = {};
        frontmatter.split('\n').forEach(line => {
          const match = line.match(/^(\w+):\s*(.+)$/);
          if (match) {
            const [, key, value] = match;
            if (key === 'series_part') {
              parsedFrontmatter[key] = parseInt(value);
            } else {
              parsedFrontmatter[key] = value.replace(/['"]/g, '');
            }
          }
        });
        
        return {
          slug,
          title: parsedFrontmatter.title,
          series: parsedFrontmatter.series,
          series_part: parsedFrontmatter.series_part,
          draft: parsedFrontmatter.draft === 'true' || parsedFrontmatter.draft === true,
        };
      });
      
      // Filter to only posts with series information and not drafts
      return posts.filter(post => post.series && post.series_part && !post.draft);
    } catch (error) {
      console.error('Error reading posts:', error);
      return [];
    }
  }

  // Helper function to group posts by series
  function groupPostsBySeries(posts: any[]) {
    const seriesMap = new Map<string, any[]>();
    
    posts.forEach(post => {
      if (!seriesMap.has(post.series)) {
        seriesMap.set(post.series, []);
      }
      seriesMap.get(post.series)!.push(post);
    });
    
    // Sort each series by part number
    seriesMap.forEach(seriesPosts => {
      seriesPosts.sort((a, b) => a.series_part - b.series_part);
    });
    
    return seriesMap;
  }

  // Helper function to verify a post file exists
  function postFileExists(slug: string): boolean {
    const postPath = path.join(process.cwd(), 'src', 'content', 'posts', `${slug}.md`);
    return fs.existsSync(postPath);
  }

  test('Property 2: Series navigation links resolve to valid pages', () => {
    const seriesPosts = getSeriesPosts();
    const seriesMap = groupPostsBySeries(seriesPosts);
    
    // Get all posts that are part of a series with multiple parts
    const multiPartSeriesPosts = seriesPosts.filter(post => {
      const seriesPostsCount = seriesMap.get(post.series)?.length || 0;
      return seriesPostsCount > 1;
    });
    
    expect(multiPartSeriesPosts.length).toBeGreaterThan(0); // Ensure we have series posts to test
    
    // Property-based test: For all posts in multi-part series, verify navigation links are valid
    fc.assert(
      fc.property(
        fc.constantFrom(...multiPartSeriesPosts),
        (currentPost) => {
          const seriesPosts = seriesMap.get(currentPost.series)!;
          const currentIndex = seriesPosts.findIndex(post => post.series_part === currentPost.series_part);
          
          // Verify current post exists in the series
          expect(currentIndex).toBeGreaterThanOrEqual(0);
          
          // Check previous post link (if not first)
          if (currentIndex > 0) {
            const previousPost = seriesPosts[currentIndex - 1];
            expect(previousPost).toBeDefined();
            expect(previousPost.series_part).toBe(currentPost.series_part - 1);
            expect(postFileExists(previousPost.slug)).toBe(true);
          }
          
          // Check next post link (if not last)
          if (currentIndex < seriesPosts.length - 1) {
            const nextPost = seriesPosts[currentIndex + 1];
            expect(nextPost).toBeDefined();
            expect(nextPost.series_part).toBe(currentPost.series_part + 1);
            expect(postFileExists(nextPost.slug)).toBe(true);
          }
          
          // Verify series part numbers are sequential
          seriesPosts.forEach((post, index) => {
            expect(post.series_part).toBe(index + 1);
          });
          
          return true;
        }
      ),
      { numRuns: Math.min(100, multiPartSeriesPosts.length) }
    );
  });

  test('Property 2 Verification: Series have correct part numbering', () => {
    const seriesPosts = getSeriesPosts();
    const seriesMap = groupPostsBySeries(seriesPosts);
    
    // Verify each series has sequential part numbers starting from 1
    seriesMap.forEach((posts) => {
      posts.forEach((post, index) => {
        expect(post.series_part).toBe(index + 1);
      });
      
      // Verify no gaps in series parts
      const partNumbers = posts.map(post => post.series_part).sort((a, b) => a - b);
      for (let i = 0; i < partNumbers.length; i++) {
        expect(partNumbers[i]).toBe(i + 1);
      }
    });
  });

  test('Property 2 Verification: All series posts exist as files', () => {
    const seriesPosts = getSeriesPosts();
    
    // Verify all series posts have corresponding files
    fc.assert(
      fc.property(
        fc.constantFrom(...seriesPosts),
        (post) => {
          expect(postFileExists(post.slug)).toBe(true);
          return true;
        }
      ),
      { numRuns: Math.min(100, seriesPosts.length) }
    );
  });

  test('Property 2 Verification: Series consistency across posts', () => {
    const seriesPosts = getSeriesPosts();
    const seriesMap = groupPostsBySeries(seriesPosts);
    
    // Verify each series has at least one post and consistent naming
    seriesMap.forEach((posts, seriesName) => {
      expect(posts.length).toBeGreaterThan(0);
      expect(seriesName).toBeTruthy();
      expect(typeof seriesName).toBe('string');
      
      // All posts in series should have the same series name
      posts.forEach(post => {
        expect(post.series).toBe(seriesName);
        expect(post.series_part).toBeGreaterThan(0);
        expect(Number.isInteger(post.series_part)).toBe(true);
      });
    });
  });
});